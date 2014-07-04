var opentype = require('../../lib/opentype.js'),
    _gl      = require('./gl'),
    glTrans  = require('./glTrans'),
    Program  = require('./Program'),
    Rect     = require('../geom/Rect'),
    Vec2     = require('../math/Vec2'),
    Vec3     = require('../math/Vec3'),
    Color    = require('../util/Color');


var GLYPH_TABLE_TEX_MAX_WIDTH = 2048;
var GLYPH_PADDING = 3;

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

    this._prevV0 = new Vec3();
    this._prevV1 = new Vec3();
    this._prevV2 = new Vec3();
    this._prevV3 = new Vec3();

    this._uv0 = new Vec2();
    this._uv1 = new Vec2();
    this._uv2 = new Vec2();
    this._uv3 = new Vec2();

    this._prevSize = new Vec2();


    this._setFontSize_Internal(24);
    this._genMapGlyph();

    this._stringLast = '';
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
    return this._font.getKerningValue(lg,rg);
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
        glyphSizeUniform; // glyph bounds equal font max bounds heights

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

        // draw every glyph with some padding to prevent overlapping

        glyphTexInfo.texcoordsMin.set(glyphOffset).mult(canvasSizeInv);
        glyphTexInfo.texcoordsMax.set(glyphOffset).add(glyphTexInfo.size).mult(canvasSizeInv);

        //glyphTexInfo.texcoordsMin.set(glyphOffset).addf(GLYPH_PADDING,GLYPH_PADDING).mult(canvasSizeInv);
        //glyphTexInfo.texcoordsMax.set(glyphOffset).add(glyphTexInfo.size).subf(GLYPH_PADDING,GLYPH_PADDING).mult(canvasSizeInv);


        //ctx.save();
        //ctx.translate(glyphOffset.x,glyphOffset.y);

        //ctx.strokeStyle = '#FFF';
        //ctx.strokeRect(0,0,glyphBounds.getWidth(),glyphBounds.getHeight());

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

        //glyphs[key].draw(ctx,0,0,fontSize);
        //ctx.fill();
        //glyphs[key].drawMetrics(ctx,0,0,fontSize);

        ctx.restore();
        //ctx.restore();
    }

    var gl = this._gl;
    var texture = this._texture,
        texturePrev = gl.getParameter(gl.TEXTURE_BINDING_2D);

    glyphTexInfo = glyphTexInfos[keys[34]];
    glyphOffset = glyphTexInfo.offset;

    ctx.save();
    ctx.translate(glyphOffset.x,glyphOffset.y);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-2,-2,4,4);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(0,0,glyphTexInfo.size.x,glyphTexInfo.size.y);
    ctx.restore();

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

    var attribLocationVertexPos    = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_POSITION),
        attribLocationVertexColor  = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_COLOR),
        attribLocationVertexNormal = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_NORMAL),
        attribLocationTexcoord     = gl.getAttribLocation(program,Program.ATTRIB_TEXCOORD);
    var uniformLocationModelViewMatrix  = gl.getUniformLocation(program,Program.UNIFORM_MODELVIEW_MATRIX),
        uniformLocationProjectionMatrix = gl.getUniformLocation(program,Program.UNIFORM_PROJECTION_MATRIX),
        uniformLocationTexture          = gl.getUniformLocation(program,Program.UNIFORM_TEXTURE);

    if(attribLocationVertexPos == -1){
        return;
    }

    color = color || COLOR_WHITE;

    var texture     = this._texture,
        prevTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);

    var prevVbo = gl.getParameter(gl.ARRAY_BUFFER_BINDING),
        bufferVertex   = this._bufferVertex,
        bufferNormal   = this._bufferNormal,
        bufferColor    = this._bufferColor,
        bufferTexcoord = this._bufferTexcoord;

    var numVerticesPerGlyph = 6;
    var numVertices = strLen * numVerticesPerGlyph;

    if(str != strLast){
        var glyphTextureInfos = this._glyphTextureInfos,
            glyphTextureInfo,
            glyphTexcoordMin,
            glyphTexcoordMax,
            glyphSize;



        var dataVertexLen   = numVertices * 3,
            dataNormalLen   = numVertices * 3,
            dataColorLen    = numVertices * 4,
            dataTexcoordLen = numVertices * 2;


        var bufferVertexData   = this._bufferVertexData,
            bufferNormalData   = this._bufferNormalData,
            bufferColorData    = this._bufferColorData,
            bufferTexcoordData = this._bufferTexcoordData;

        var i, j, k, l = strLen;

        var v0 = this._v0,
            v1 = this._v1,
            v2 = this._v2,
            v3 = this._v3;

        var uv0 = this._uv0,
            uv1 = this._uv1,
            uv2 = this._uv2,
            uv3 = this._uv3;

        var prevV0 = this._prevV0,
            prevV1 = this._prevV1,
            prevV2 = this._prevV2,
            prevV3 = this._prevV3;

        var colorR = color.r,
            colorG = color.g,
            colorB = color.b,
            colorA = color.a;

        if(strLen != strLast.length){
            bufferVertexData   = this._bufferVertexData   = new Float32Array(dataVertexLen);
            bufferNormalData   = this._bufferNormalData   = new Float32Array(dataNormalLen);
            bufferColorData    = this._bufferColorData    = new Float32Array(dataColorLen);
            bufferTexcoordData = this._bufferTexcoordData = new Float32Array(dataTexcoordLen);

            i = -1;
            while(++i < l){
                glyphTextureInfo = glyphTextureInfos[str[i]];
                glyphSize        = glyphTextureInfo.size;
                glyphTexcoordMin = glyphTextureInfo.texcoordsMin;
                glyphTexcoordMax = glyphTextureInfo.texcoordsMax;

                v0.set3f(prevV1.x, 0, 0);
                v1.set3f(v0.x + glyphSize.x, v0.y, 0);
                v2.set3f(v0.x, v0.y + glyphSize.y, 0);
                v3.set3f(v1.x, v2.y, 0);

                prevV0.set(v0);
                prevV1.set(v1);
                prevV2.set(v2);
                prevV3.set(v3);

                uv0.setf(glyphTexcoordMin.x, glyphTexcoordMin.y);
                uv1.setf(glyphTexcoordMax.x, uv0.y);
                uv2.setf(uv0.x, glyphTexcoordMax.y);
                uv3.setf(uv1.x, uv2.y);

                //        1      0--1    0--1   2,3,1
                //       /|      | /     |  |
                //      / |      |/      |  |
                //     2--3      2       2--3


                j = i * numVerticesPerGlyph;
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

            prevV0.toZero();
            prevV1.toZero();
            prevV2.toZero();
            prevV3.toZero();

            gl.bindBuffer(gl.ARRAY_BUFFER,bufferVertex);
            gl.bufferData(gl.ARRAY_BUFFER,bufferVertexData,gl.STREAM_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER,bufferNormal);
            gl.bufferData(gl.ARRAY_BUFFER,bufferNormalData,gl.STREAM_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER,bufferColor);
            gl.bufferData(gl.ARRAY_BUFFER,bufferColorData,gl.STREAM_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER,bufferTexcoord);
            gl.bufferData(gl.ARRAY_BUFFER,bufferTexcoordData,gl.STREAM_DRAW);



            //update all buffers
        } else {
            //just update the vertex buffer & texcoord buffer
        }
    }




    /*
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    if(str != strLast){
        var glyphTextureInfos = this._glyphTextureInfos,
            glyphTextureInfo,
            glyphTexcoordMin,
            glyphTexcoordMax,
            glyphSize;

        if(strLen != strLast.length){

            // calc data comps

            var dataVertexLen   = numVertices * 3,
                dataNormalLen   = numVertices * 3,
                dataColorLen    = numVertices * 4,
                dataTexcoordLen = numVertices * 2;

            var dataLen = dataVertexLen + dataNormalLen + dataColorLen + dataTexcoordLen;

            data               = this._bufferGlyphsData = new Float32Array(dataLen);
            offsetDataVertex   = this._bufferGlyphsDataVertexOffset = 0;
            offsetDataNormal   = this._bufferGlyphsDataNormalOffset = offsetDataVertex + dataVertexLen;
            offsetDataColor    = this._bufferGlyphsDataColorOffset  = offsetDataNormal + dataNormalLen;
            offsetDataTexcoord = this._bufferGlyphsDataColorOffset  = offsetDataColor + dataColorLen;

            var offset, offsetObj;

            var v0 = new Vec3(),
                v1 = new Vec3(),
                v2 = new Vec3(),
                v3 = new Vec3();

            var uv0 = new Vec2(),
                uv1 = new Vec2(),
                uv2 = new Vec2(),
                uv3 = new Vec2();

            var i = -1;
            while(++i < strLen){
                glyphTextureInfo = glyphTextureInfos[str[i]];
                glyphSize        = glyphTextureInfo.size;
                glyphTexcoordMin = glyphTextureInfo.texcoordsMin;
                glyphTexcoordMax = glyphTextureInfo.texcoordsMax;

                // data vertex

                //        1      0--1    0--1   2,3,1
                //       /|      | /     |  |
                //      / |      |/      |  |
                //     2--3      2       2--3

                offset = (offsetDataVertex + i * 6 * 3);

                v0.set3f(0, 0, 0);
                v1.set3f(v0.x + glyphSize.x, v0.y, 0);
                v2.set3f(v0.x, v0.y + glyphSize.y, 0);
                v3.set3f(v1.x, v2.x, 0);


                data[offset   ] = v0.x;
                data[offset+ 1] = v0.y;
                data[offset+ 2] = v0.z;

                data[offset+ 3] = v2.x;
                data[offset+ 4] = v2.y;
                data[offset+ 5] = v2.z;

                data[offset+ 6] = v1.x;
                data[offset+ 7] = v1.y;
                data[offset+ 8] = v1.z;

                data[offset+ 9] = v1.x;
                data[offset+10] = v1.y;
                data[offset+11] = v1.z;

                data[offset+12] = v2.x;
                data[offset+13] = v2.y;
                data[offset+14] = v2.z;

                data[offset+15] = v3.x;
                data[offset+16] = v3.y;
                data[offset+17] = v3.z;

                // data normal

                offset = (offsetDataNormal + i * 6 * 3);

                data[offset   ] = data[offset+ 3] = data[offset+ 6] =
                data[offset+ 9] = data[offset+12] = data[offset+15] = 1.0;

                data[offset+ 1] = data[offset+ 2] = data[offset+ 4] =
                data[offset+ 5] = data[offset+ 7] = data[offset+ 8] =
                data[offset+10] = data[offset+11] = data[offset+13] =
                data[offset+14] = data[offset+16] = data[offset+17] = 0.0;

                // data color

                offset = (offsetDataColor + i * 6 * 4);

                data[offset   ] = data[offset+ 4] = data[offset+ 8] =
                data[offset+12] = data[offset+16] = data[offset+20] = color.r;

                data[offset+ 1] = data[offset+ 5] = data[offset+ 9] =
                data[offset+13] = data[offset+17] = data[offset+21] = color.g;

                data[offset+ 2] = data[offset+ 6] = data[offset+10] =
                data[offset+14] = data[offset+18] = data[offset+22] = color.b;

                data[offset+ 3] = data[offset+ 7] = data[offset+11] =
                data[offset+15] = data[offset+19] = data[offset+23] = color.a;

                // data texcoord

                offset = (offsetDataTexcoord + i * 6 * 2);

                uv0.setf(glyphTexcoordMin.x, glyphTexcoordMin.y);
                uv1.setf(glyphTexcoordMax.x, uv0.y);
                uv2.setf(uv0.x, glyphTexcoordMax.y);
                uv3.setf(uv1.x, uv2.y);

                // 0: 0,1 - 1: 2,3 - 2: 4,5 - 3

                data[offset   ] = uv0.x;
                data[offset+ 1] = uv0.y;

                data[offset+ 2] = uv2.x;
                data[offset+ 3] = uv2.y;

                data[offset+ 4] = uv1.x;
                data[offset+ 5] = uv1.y;

                data[offset+ 6] = uv1.x;
                data[offset+ 7] = uv1.y;

                data[offset+ 8] = uv2.x;
                data[offset+ 9] = uv2.y;

                data[offset+10] = uv3.x;
                data[offset+11] = uv3.y;

            }

            offsetDataVertex   *= 4;
            offsetDataNormal   *= 4;
            offsetDataColor    *= 4;
            offsetDataTexcoord *= 4;


        } else {

        }

        gl.bufferData(gl.ARRAY_BUFFER,data.byteLength,gl.STREAM_DRAW);

    } else {

    }
    */

    /*
    gl.vertexAttribPointer(attribLocationVertexPos,3,gl.FLOAT,false,0,offsetDataVertex);

    if(attribLocationVertexNormal != -1){
        gl.vertexAttribPointer(attribLocationVertexNormal,3,gl.FLOAT,false,0,offsetDataNormal);
    }
    if(attribLocationVertexColor != -1){
        gl.vertexAttribPointer(attribLocationVertexColor,4,gl.FLOAT,false,0,offsetDataColor);
    }
    if(attribLocationTexcoord != -1){
        gl.vertexAttribPointer(attribLocationTexcoord,4,gl.FLOAT,false,0,offsetDataTexcoord);
    }*/

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

TextureFont.prototype.getGlyphTableGLTexture = function(){
    return this._texture;
}

TextureFont.prototype.getGlyphTableGLTextureSize = function(v){
    return this._textureSize.copy(v);
}

TextureFont.loadAsync = function(path, callback){
    var request = new XMLHttpRequest();
    request.open('GET',path);
    request.responseType = 'arraybuffer';
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            if(request.status == 200){
                callback(new TextureFont(request.response));
            }
        }
    };
    request.send();
};


module.exports = TextureFont;