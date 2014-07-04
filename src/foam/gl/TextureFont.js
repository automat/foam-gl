var opentype = require('../../lib/opentype.js'),
    _gl      = require('./gl'),
    glTrans  = require('./glTrans'),
    Program  = require('./Program'),
    Rect     = require('../geom/Rect'),
    Vec2     = require('../math/Vec2'),
    Vec3     = require('../math/Vec3'),
    Color    = require('../util/Color');


var GLYPH_TABLE_TEX_MAX_WIDTH = 2048;

var GLYPH_PADDING      = 10,
    GLYPH_PADDING_2    = GLYPH_PADDING * 2,
    GLYPH_ERROR_MARGIN = 1,
    GLYPH_PADDING_2_MARGIN = GLYPH_PADDING_2 - GLYPH_ERROR_MARGIN;

var GLYPH_NUM_VERTICES = 6;


function GlyphTextureInfo(){
    this.offset = new Vec2();
    this.size = new Vec2();
    this.baseOffset = 0;

    this.texcoordsMin = new Vec2();
    this.texcoordsMax = new Vec2();
}

function Metrics(){
    this.bounds = new Rect();
    this.ascent = this.descent = 0;
}

function GlyphMetrics(){
    Metrics.call(this);
    this.uniformBounds = new Rect();
    this.advanceWidth = 0;
    this.leftSideBearing = 0;
}

function FontMetrics(){
    Metrics.call(this);
    this.advanceWidthMax = 0;
    this.minLeftSideBearing = this.minRightSideBearing = 0;
}

// TextureFont

function TextureFont(arraybuffer){
    this._glyphs = {};
    this._glyphMetrics = {};
    this._glyphTextureInfos = {};
    this._charsSupported = TextureFont.getSupportedCharsDefault();
    this._charsSupportedKeys = this._charsSupported.split('');

    this._fontSize    = this._scale = 0;
    this._font        = opentype.parse(arraybuffer);
    this._fontMetrics = new FontMetrics();

    var gl = this._gl = _gl.get();
    var texture       = this._texture = gl.createTexture(),
        texturePrev   = gl.getParameter(gl.TEXTURE_BINDING_2D);
    this._textureSize = new Vec2();

    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D,texturePrev);

    this._bufferVertex   = gl.createBuffer();
    this._bufferNormal   = gl.createBuffer();
    this._bufferTexcoord = gl.createBuffer();
    this._bufferColor    = gl.createBuffer();
    this._bufferVertexData   = null;
    this._bufferNormalData   = null;
    this._bufferTexcoordData = null;
    this._bufferColorData    = null;

    this._v0 = new Vec3();
    this._v1 = new Vec3();
    this._v2 = new Vec3();
    this._v3 = new Vec3();

    this._uv0 = new Vec2();
    this._uv1 = new Vec2();
    this._uv2 = new Vec2();
    this._uv3 = new Vec2();

    this._prevSize = new Vec2();

    this._setFontSize_Internal(24);
    this._genMapGlyph();

    this._stringLast = '';

    // gl state cache, Foam.Program idenpendent

    this._programRefLast = null;
    this._attribLocationVertexPos = null;
    this._attribLocationVertexNormal = null;
    this._attribLocationVertexColor = null;
    this._attribLocationTexcoord = null;
    this._uniformLocationModelViewMatrix = null;
    this._uniformLocationProjectionMatrix = null;
    this._uniformLocationTexture = null;
}

TextureFont.prototype.setCharsSupported = function(chars){
    this._charsSupported = chars;
    this._genMapGlyph();
};

TextureFont.prototype.getCharsSupported = function(){
    return this._charsSupported;
};

TextureFont.getSupportedCharsDefault = function(){
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.?!,;:'\"()&*=+-/\\@#_[]<>% ";
};

TextureFont.prototype._setFontSize_Internal = function(fontSize){
    var font  = this._font;
    var scale = this._scale = 1.0 / font.unitsPerEm * fontSize;

    var hheaTable   = font.tables.hhea;
    var fontMetrics = this._fontMetrics;

    fontMetrics.advanceWidthMax     = hheaTable.advanceWidthMax * scale;
    fontMetrics.ascent              = hheaTable.ascender * scale;
    fontMetrics.descent             = hheaTable.descender * scale;
    fontMetrics.minLeftSideBearing  = hheaTable.minLeftSideBearing * scale;
    fontMetrics.minRightSideBearing = hheaTable.minRightSideBearing * scale;

    this._fontSize = fontSize;
};

TextureFont.prototype.setFontSize = function(fontSize){
    this._setFontSize_Internal(fontSize);
    this._genMapGlyph();
};

TextureFont.prototype.getFontSize = function(){
    return this._fontSize;
};

TextureFont.prototype._getKerningValue = function(leftChar,rightChar){
    if(leftChar == null || rightChar == null){
        return 0;
    }

    var mapGlyph = this._glyphs;
    var lg = mapGlyph[leftChar],
        rg = mapGlyph[rightChar];
    var msg = "Char not supported: ";
    if(!lg && rg){
        console.log(msg + leftChar + '.');
        return -1;
    } else if(lg && !rg){
        console.log(msg + rightChar + '.');
        return -1;
    } else if(!lg && !rg) {
        console.log('Chars not supported: ' + leftChar + ', ' + rightChar + '.');
        return -1;
    }
    return this._font.getKerningValue(lg,rg) * this._scale;
};

TextureFont.prototype._genMapGlyph = function(){
    var supportedChars = this._charsSupported;
    var keys = supportedChars.split('');

    var font       = this._font,
        fontSize   = this._fontSize,
        fontBounds = this._fontMetrics.bounds;
        fontBounds.min.toMax();
        fontBounds.max.toMin();

    var glyphs = this._glyphs = {},
        glyphMetrics = this._glyphMetrics = {},
        glyphBounds  = new Rect(),
        glyphBoundsUniform = new Rect();

    var scale = this._scale;

    var glyph, metrics;
    var glyphXMin, glyphXMax,
        glyphYMin, glyphYMax;
    var glyphPathCmds,
        glyphPathCmd;
    var glyphPoints = [];
    var glyphMaxSize = Vec2.min();

    var key, k, i, l;

    for(k in keys){
        key = keys[k];
        glyph = glyphs[key] = !glyphs[key] ? font.charToGlyph(key) : glyphs[key];

        glyphXMin = glyph.xMin * scale;
        glyphYMin = glyph.yMax * scale * -1;
        glyphXMax = glyph.xMax * scale;
        glyphYMax = glyph.yMin * scale * -1;

        if(glyphXMin == 0 && glyphYMin == 0 &&
           glyphXMax == 0 && glyphYMax == 0 && glyph.path){
            // fallback
            glyphPathCmds = glyph.path.commands;
            l = glyphPoints.length = glyphPathCmds.length;
            i = -1;
            while(++i < l){
                glyphPathCmd = glyphPathCmds[i];
                glyphPoints[i] = new Vec2(glyphPathCmd.x * scale,
                                          glyphPathCmd.y * scale);
            }
            glyphBounds.includePoints(glyphPoints);
        } else {
            glyphBounds.setf(glyphXMin,glyphYMin,
                             glyphXMax,glyphYMax);
        }

        glyphBounds.min.x -= GLYPH_PADDING;
        glyphBounds.min.y -= GLYPH_PADDING;
        glyphBounds.max.x += GLYPH_PADDING;
        glyphBounds.max.y += GLYPH_PADDING;

        glyphMaxSize.x = Math.max(glyphMaxSize.x, glyphBounds.getWidth());
        glyphMaxSize.y = Math.max(glyphMaxSize.y, glyphBounds.getHeight());

        fontBounds.include(glyphBounds);

        metrics = glyphMetrics[key] = new GlyphMetrics();
        metrics.bounds.set(glyphBounds);
        metrics.uniformBounds.set(glyphBounds);
        metrics.advanceWidth = glyph.advanceWidth * scale;
        metrics.leftSideBearing = glyph.leftSideBearing * scale;
    }

    for(k in keys){
        key = keys[k];
        glyphBoundsUniform = glyphMetrics[key].uniformBounds;
        glyphBoundsUniform.min.y = fontBounds.min.y;
        glyphBoundsUniform.max.y = fontBounds.max.y;
    }

    // sort on height

    keys.sort(function(a,b){
        var aheight = glyphMetrics[a].bounds.getHeight(),
            bheight = glyphMetrics[b].bounds.getHeight();
        return aheight < bheight ? 1 : aheight > bheight ? -1 : 0;
    });

    // gen gl texture
    // no rectangle packing for now

    var canvas = document.createElement('canvas');
    var canvasSize = this._textureSize.toZero(),
        canvasSizeInv = new Vec2();

    var ctx = canvas.getContext('2d');

    var glyphTexInfos = this._glyphTextureInfos = {},
        glyphTexInfo;

    var glyphOffset = new Vec2(),
        glyphOffsetYBase = fontBounds.getHeight(),
        glyphSize,
        glyphSizeUniform, // glyph bounds equal font max bounds heights
        glyphTexcoordsMin,
        glyphTexcoordsMax;

    i = -1;
    l = keys.length;

    while(++i < l){
        key = keys[i];
        metrics = glyphMetrics[key];
        glyphSize = metrics.bounds.getSize();
        glyphSizeUniform = metrics.uniformBounds.getSize();

        if((glyphOffset.x + glyphSizeUniform.x) >= GLYPH_TABLE_TEX_MAX_WIDTH){
            glyphOffset.x = 0;
            glyphOffset.y+= glyphOffsetYBase;
            glyphOffsetYBase = glyphSizeUniform.y;
        }

        glyphTexInfo = glyphTexInfos[key] = new GlyphTextureInfo();
        glyphTexInfo.offset.set(glyphOffset);
        glyphTexInfo.size.set(glyphSizeUniform);

        glyphTexInfo.baseOffset = glyphSizeUniform.y - glyphSize.y;


        glyphOffset.x += glyphSizeUniform.x;
        canvasSize.x   = Math.max(glyphOffset.x, canvasSize.x);
        canvasSize.y   = Math.max(glyphOffset.y, canvasSize.y);
    }

    canvasSize.y   += glyphOffsetYBase;
    canvasSizeInv.x = 1.0 / canvasSize.x;
    canvasSizeInv.y = 1.0 / canvasSize.y;

    canvas.width  = canvasSize.x;
    canvas.height = canvasSize.y;

    var j,cmd,cmds;

    ctx.fillStyle = '#fff';

    i = -1;
    while(++i < l){
        key = keys[i];

        glyphTexInfo = glyphTexInfos[key];
        glyphOffset  = glyphTexInfo.offset;
        glyphBounds  = glyphMetrics[key].uniformBounds;

        ctx.save();
        ctx.translate(glyphOffset.x + glyphBounds.min.x * -1,
                      glyphOffset.y + glyphBounds.min.y * -1);

        cmds = glyphs[key].getPath(0,0,fontSize).commands;

        j = -1;
        k = cmds.length;

        ctx.beginPath();
        while(++j < k){
            cmd = cmds[j];
            if (cmd.type === 'M') {
                ctx.moveTo(cmd.x, cmd.y);
            } else if (cmd.type === 'L') {
                ctx.lineTo(cmd.x, cmd.y);
            } else if (cmd.type === 'C') {
                ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
            } else if (cmd.type === 'Q') {
                ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
            } else if (cmd.type === 'Z') {
                ctx.closePath();
            }
        }
        ctx.fill();
        ctx.restore();

        glyphSize         = glyphTexInfo.size;
        glyphTexcoordsMin = glyphTexInfo.texcoordsMin;
        glyphTexcoordsMax = glyphTexInfo.texcoordsMax;

        // draw every glyph with some padding to prevent overlapping

        glyphTexcoordsMin.set(glyphOffset).addf(GLYPH_PADDING,GLYPH_PADDING);
        glyphSize.subf(GLYPH_PADDING_2_MARGIN,GLYPH_PADDING_2_MARGIN);

        glyphTexcoordsMax.set(glyphTexcoordsMin).add(glyphSize);
        glyphTexcoordsMin.mult(canvasSizeInv);
        glyphTexcoordsMax.mult(canvasSizeInv);
    }

    var gl = this._gl;
    var texture = this._texture,
        texturePrev = gl.getParameter(gl.TEXTURE_BINDING_2D);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.bindTexture(gl.TEXTURE_2D, texturePrev);
};

var COLOR_WHITE = Color.black();

TextureFont.prototype.drawString = function(str,color){
    var strLast = this._stringLast;
    var strLen = str.length;
    if(strLen == 0){
        return;
    }

    var gl      = this._gl,
        program = gl.getParameter(gl.CURRENT_PROGRAM);

    // fetch current program states
    if(program != this._programRefLast){
        this._attribLocationVertexPos = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_POSITION);
        this._attribLocationVertexColor = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_COLOR);
        this._attribLocationVertexNormal = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_NORMAL);
        this._attribLocationTexcoord = gl.getAttribLocation(program,Program.ATTRIB_TEXCOORD);

        this._uniformLocationModelViewMatrix = gl.getUniformLocation(program,Program.UNIFORM_MODELVIEW_MATRIX);
        this._uniformLocationProjectionMatrix = gl.getUniformLocation(program,Program.UNIFORM_PROJECTION_MATRIX);
        this._uniformLocationTexture = gl.getUniformLocation(program,Program.UNIFORM_TEXTURE);

        this._programRefLast = program;
    }

    var attribLocationVertexPos    = this._attribLocationVertexPos ,
        attribLocationVertexColor  = this._attribLocationVertexColor,
        attribLocationVertexNormal = this._attribLocationVertexNormal,
        attribLocationTexcoord     = this._attribLocationTexcoord;
    var uniformLocationModelViewMatrix  = this._uniformLocationModelViewMatrix,
        uniformLocationProjectionMatrix = this._uniformLocationProjectionMatrix,
        uniformLocationTexture          = this._uniformLocationTexture;

    if(attribLocationVertexPos == -1){
        return;
    }

    color = color || COLOR_WHITE;

    var numVertices = strLen * GLYPH_NUM_VERTICES;

    var texture     = this._texture,
        prevTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
    var prevVbo = gl.getParameter(gl.ARRAY_BUFFER_BINDING);

    var bufferVertex   = this._bufferVertex,
        bufferNormal   = this._bufferNormal,
        bufferColor    = this._bufferColor,
        bufferTexcoord = this._bufferTexcoord;


    if(str != strLast){
        var char;

        var textureInfos = this._glyphTextureInfos,
            textureInfo;
        var metrics = this._glyphMetrics,
            metric;
        var texcoordMin,
            texcoordMax,
            size;

        var dataVertexLen   = numVertices * 3,
            dataNormalLen   = numVertices * 3,
            dataColorLen    = numVertices * 4,
            dataTexcoordLen = numVertices * 2;


        var bufferVertexData   = this._bufferVertexData,
            bufferNormalData   = this._bufferNormalData,
            bufferColorData    = this._bufferColorData,
            bufferTexcoordData = this._bufferTexcoordData;

        var j, k, l = strLen;

        var v0 = this._v0,
            v1 = this._v1,
            v2 = this._v2,
            v3 = this._v3;

        var uv0 = this._uv0,
            uv1 = this._uv1,
            uv2 = this._uv2,
            uv3 = this._uv3;

        var prevAdvance = 0;

        var colorR = color.r,
            colorG = color.g,
            colorB = color.b,
            colorA = color.a;

        var kerning;
        var prevAdvanceWidth = 0;

        if(strLen != strLast.length){
            //update all buffers

            bufferVertexData   = this._bufferVertexData   = new Float32Array(dataVertexLen);
            bufferNormalData   = this._bufferNormalData   = new Float32Array(dataNormalLen);
            bufferColorData    = this._bufferColorData    = new Float32Array(dataColorLen);
            bufferTexcoordData = this._bufferTexcoordData = new Float32Array(dataTexcoordLen);

            i = -1;
            while(++i < l){
                char = str[i];

                textureInfo = textureInfos[char];
                metric      = metrics[char];

                size        = textureInfo.size;
                texcoordMin = textureInfo.texcoordsMin;
                texcoordMax = textureInfo.texcoordsMax;

                kerning = this._getKerningValue(str[i-1],str[i]);

                v0.set3f(prevAdvance + metric.leftSideBearing, 0, 0);
                v1.set3f(v0.x + size.x, v0.y, 0);
                v2.set3f(v0.x, v0.y + size.y, 0);
                v3.set3f(v1.x, v2.y, 0);

                prevAdvance += metric.advanceWidth + kerning;;

                uv0.setf(texcoordMin.x, texcoordMin.y);
                uv1.setf(texcoordMax.x, uv0.y);
                uv2.setf(uv0.x, texcoordMax.y);
                uv3.setf(uv1.x, uv2.y);


                //        1      0--1    0--1   2,3,1
                //       /|      | /     |  |
                //      / |      |/      |  |
                //     2--3      2       2--3


                j = i * GLYPH_NUM_VERTICES;
                // vertices
                k = j * 3;
                bufferVertexData[k   ] = v0.x;
                bufferVertexData[k+ 1] = v0.y;
                bufferVertexData[k+ 2] = v0.z;

                bufferVertexData[k+ 3] = v2.x;
                bufferVertexData[k+ 4] = v2.y;
                bufferVertexData[k+ 5] = v2.z;

                bufferVertexData[k+ 6] = v1.x;
                bufferVertexData[k+ 7] = v1.y;
                bufferVertexData[k+ 8] = v1.z;

                bufferVertexData[k+ 9] = v1.x;
                bufferVertexData[k+10] = v1.y;
                bufferVertexData[k+11] = v1.z;

                bufferVertexData[k+12] = v2.x;
                bufferVertexData[k+13] = v2.y;
                bufferVertexData[k+14] = v2.z;

                bufferVertexData[k+15] = v3.x;
                bufferVertexData[k+16] = v3.y;
                bufferVertexData[k+17] = v3.z;


                // normals
                bufferNormalData[k   ] = bufferNormalData[k+ 3] = bufferNormalData[k+ 6] =
                bufferNormalData[k+ 9] = bufferNormalData[k+12] = bufferNormalData[k+15] = 1.0;

                bufferNormalData[k+ 1] = bufferNormalData[k+ 2] = bufferNormalData[k+ 4] =
                bufferNormalData[k+ 5] = bufferNormalData[k+ 7] = bufferNormalData[k+ 8] =
                bufferNormalData[k+10] = bufferNormalData[k+11] = bufferNormalData[k+13] =
                bufferNormalData[k+14] = bufferNormalData[k+16] = bufferNormalData[k+17] = 0.0;


                // colors
                k = j * 4;
                bufferColorData[k   ] = bufferColorData[k+ 4] = bufferColorData[k+ 8] =
                bufferColorData[k+12] = bufferColorData[k+16] = bufferColorData[k+20] = colorR;

                bufferColorData[k+ 1] = bufferColorData[k+ 5] = bufferColorData[k+ 9] =
                bufferColorData[k+13] = bufferColorData[k+17] = bufferColorData[k+21] = colorG;

                bufferColorData[k+ 2] = bufferColorData[k+ 6] = bufferColorData[k+10] =
                bufferColorData[k+14] = bufferColorData[k+18] = bufferColorData[k+22] = colorB;

                bufferColorData[k+ 3] = bufferColorData[k+ 7] = bufferColorData[k+11] =
                bufferColorData[k+15] = bufferColorData[k+19] = bufferColorData[k+23] = colorA;

                // texcoord
                k = j * 2;
                bufferTexcoordData[k   ] = uv0.x;
                bufferTexcoordData[k+ 1] = uv0.y;

                bufferTexcoordData[k+ 2] = uv2.x;
                bufferTexcoordData[k+ 3] = uv2.y;

                bufferTexcoordData[k+ 4] = uv1.x;
                bufferTexcoordData[k+ 5] = uv1.y;

                bufferTexcoordData[k+ 6] = uv1.x;
                bufferTexcoordData[k+ 7] = uv1.y;

                bufferTexcoordData[k+ 8] = uv2.x;
                bufferTexcoordData[k+ 9] = uv2.y;

                bufferTexcoordData[k+10] = uv3.x;
                bufferTexcoordData[k+11] = uv3.y;

            }

            gl.bindBuffer(gl.ARRAY_BUFFER,bufferVertex);
            gl.bufferData(gl.ARRAY_BUFFER,bufferVertexData,gl.STREAM_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER,bufferNormal);
            gl.bufferData(gl.ARRAY_BUFFER,bufferNormalData,gl.STREAM_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER,bufferColor);
            gl.bufferData(gl.ARRAY_BUFFER,bufferColorData,gl.STREAM_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER,bufferTexcoord);
            gl.bufferData(gl.ARRAY_BUFFER,bufferTexcoordData,gl.STREAM_DRAW);

        } else {
            //just update the vertex buffer & texcoord buffer

            bufferVertexData   = this._bufferVertexData   = new Float32Array(dataVertexLen);
            bufferTexcoordData = this._bufferTexcoordData = new Float32Array(dataTexcoordLen);

            i = -1;
            while(++i < l){
                char = str[i];

                textureInfo = textureInfos[char];
                metric      = metrics[char];

                size        = textureInfo.size;
                texcoordMin = textureInfo.texcoordsMin;
                texcoordMax = textureInfo.texcoordsMax;

                kerning = this._getKerningValue(str[i-1],str[i]);

                v0.set3f(prevAdvance, 0, 0);
                v1.set3f(v0.x + size.x, v0.y, 0);
                v2.set3f(v0.x, v0.y + size.y, 0);
                v3.set3f(v1.x, v2.y, 0);

                prevAdvance = metric.advanceWidth + kerning;

                uv0.setf(texcoordMin.x, texcoordMin.y);
                uv1.setf(texcoordMax.x, uv0.y);
                uv2.setf(uv0.x, texcoordMax.y);
                uv3.setf(uv1.x, uv2.y);

                j = i * GLYPH_NUM_VERTICES;
                // vertices
                k = j * 3;
                bufferVertexData[k   ] = v0.x;
                bufferVertexData[k+ 1] = v0.y;
                bufferVertexData[k+ 2] = v0.z;

                bufferVertexData[k+ 3] = v2.x;
                bufferVertexData[k+ 4] = v2.y;
                bufferVertexData[k+ 5] = v2.z;

                bufferVertexData[k+ 6] = v1.x;
                bufferVertexData[k+ 7] = v1.y;
                bufferVertexData[k+ 8] = v1.z;

                bufferVertexData[k+ 9] = v1.x;
                bufferVertexData[k+10] = v1.y;
                bufferVertexData[k+11] = v1.z;

                bufferVertexData[k+12] = v2.x;
                bufferVertexData[k+13] = v2.y;
                bufferVertexData[k+14] = v2.z;

                bufferVertexData[k+15] = v3.x;
                bufferVertexData[k+16] = v3.y;
                bufferVertexData[k+17] = v3.z;

                // texcoord
                k = j * 2;
                bufferTexcoordData[k   ] = uv0.x;
                bufferTexcoordData[k+ 1] = uv0.y;

                bufferTexcoordData[k+ 2] = uv2.x;
                bufferTexcoordData[k+ 3] = uv2.y;

                bufferTexcoordData[k+ 4] = uv1.x;
                bufferTexcoordData[k+ 5] = uv1.y;

                bufferTexcoordData[k+ 6] = uv1.x;
                bufferTexcoordData[k+ 7] = uv1.y;

                bufferTexcoordData[k+ 8] = uv2.x;
                bufferTexcoordData[k+ 9] = uv2.y;

                bufferTexcoordData[k+10] = uv3.x;
                bufferTexcoordData[k+11] = uv3.y;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER,bufferVertex);
            gl.bufferData(gl.ARRAY_BUFFER,bufferVertexData,gl.STREAM_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER,bufferTexcoord);
            gl.bufferData(gl.ARRAY_BUFFER,bufferTexcoordData,gl.STREAM_DRAW);
        }
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.bindBuffer(gl.ARRAY_BUFFER,bufferVertex);
    gl.vertexAttribPointer(attribLocationVertexPos,3,gl.FLOAT,false,0,0);

    if(attribLocationVertexColor != -1){
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
        gl.vertexAttribPointer(attribLocationVertexColor,4,gl.FLOAT,false,0,0);
    }
    if(attribLocationVertexNormal != -1){
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormal);
        gl.vertexAttribPointer(attribLocationVertexNormal,3,gl.FLOAT,false,0,0);
    }
    if(attribLocationTexcoord != -1){
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferTexcoord);
        gl.vertexAttribPointer(attribLocationTexcoord,2,gl.FLOAT,false,0,0);
    }

    gl.uniformMatrix4fv(uniformLocationModelViewMatrix, false, glTrans.getModelViewMatrixF32());
    gl.uniformMatrix4fv(uniformLocationProjectionMatrix,false, glTrans.getProjectionMatrixF32());

    gl.drawArrays(gl.TRIANGLES,0,numVertices);

    gl.bindTexture(gl.TEXTURE_2D, prevTexture);
    gl.bindBuffer(gl.ARRAY_BUFFER, prevVbo);

    this._stringLast = str;
};

TextureFont.prototype.measureText = function(str){

}

TextureFont.prototype.getGlyphTableGLTexture = function(){
    return this._texture;
}

TextureFont.prototype.getGlyphTableGLTextureSize = function(v){
    return this._textureSize.copy(v);
}


module.exports = TextureFont;