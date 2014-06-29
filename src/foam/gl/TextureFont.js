var opentype = require('../../lib/opentype.js'),
    Rect = require('../geom/Rect'),
    Vec2 = require('../math/Vec2'),
    _gl = require('./gl');

var GLYPH_PADDING = 5;

function GlyphTextureInfo(){
    this.offset = new Vec2();
    this.size = new Vec2();
    this.baseOffset = 0;
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

    this._fontSize = this._scale = 0;
    this._font = opentype.parse(arraybuffer);
    this._fontMetrics = new FontMetrics();

    this._canvas = null;

    //var gl = this._gl = _gl.get();
    //this._texture = gl.createTexture();

    this._setFontSize_Internal(24);
    this._genMapGlyph();
}

TextureFont.prototype.setCharsSupported = function(chars){
    this._charsSupported = chars;
    this._genMapGlyph();
};

TextureFont.prototype.getCharsSupported = function(){
    return this._charsSupported;
};

TextureFont.prototype.getGlyph = function(char){
    var glyph = this._glyphs[char];
    if(!glyph) {
        return null;
    }
    return glyph;
};

TextureFont.getSupportedCharsDefault = function(){
    return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.?!,;:'\"()&*=+-/\\@#_[]<>%";
};

TextureFont.prototype._setFontSize_Internal = function(fontSize){
    var font = this._font;
    var scale = this._scale = 1.0 / font.unitsPerEm * fontSize;

    var hheaTable = font.tables.hhea;
    var fontMetrics = this._fontMetrics;

    fontMetrics.advanceWidthMax = hheaTable.advanceWidthMax * scale;
    fontMetrics.ascent = hheaTable.ascender * scale;
    fontMetrics.descent = hheaTable.descender * scale;
    fontMetrics.minLeftSideBearing = hheaTable.minLeftSideBearing * scale;
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

TextureFont.prototype.getKerningValue = function(leftChar,rightChar){
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

    var font = this._font,
        fontSize = this._fontSize,
        fontBounds = this._fontMetrics.bounds;
        fontBounds.min.toMax();
        fontBounds.max.toMin();

    var glyphs = this._glyphs = {},
        glyphMetrics = this._glyphMetrics = {},
        glyphBounds = new Rect(),
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
           glyphXMax == 0 && glyphYMax == 0){
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

    this._canvas = null;

    // gen gl texture
    // no rectangle packing for now

    var canvas = this._canvas = document.createElement('canvas'),
        canvasWidthMax = 800,
        canvasSize = new Vec2();

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


        if((glyphOffset.x + glyphSizeUniform.x) >= canvasWidthMax){
            glyphOffset.x = 0;
            glyphOffset.y += glyphOffsetYBase;
            glyphOffsetYBase = glyphSizeUniform.y;
        }

        glyphTexInfo = glyphTexInfos[key] = new GlyphTextureInfo();
        glyphTexInfo.offset.set(glyphOffset);
        glyphTexInfo.baseOffset = glyphSizeUniform.y - glyphSize.y;
        glyphTexInfo.size.set(glyphSizeUniform);

        glyphOffset.x += glyphSizeUniform.x;
        canvasSize.x = Math.max(glyphOffset.x, canvasSize.x);
        canvasSize.y = Math.max(glyphOffset.y, canvasSize.y);
    }

    canvas.width = canvasSize.x;
    canvas.height = canvasSize.y + glyphOffsetYBase;

    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(0,0,canvasSize.x,canvas.height);
    ctx.fill();

    i = -1;
    while(++i < l){
        key = keys[i];

        glyphTexInfo = glyphTexInfos[key];
        glyphOffset = glyphTexInfo.offset;
        glyphSize = glyphTexInfo.size;
        glyphBounds = glyphMetrics[key].uniformBounds;

        ctx.save();
        ctx.translate(glyphOffset.x,glyphOffset.y);

        //ctx.strokeStyle = '#FFF';
        //ctx.strokeRect(0,0,glyphBounds.getWidth(),glyphBounds.getHeight());

        ctx.save();
        ctx.translate(-glyphBounds.min.x, -glyphBounds.min.y);

        glyphs[key].draw(ctx,0,0,fontSize);
        //glyphs[key].drawMetrics(ctx,0,0,fontSize);

        ctx.restore();
        ctx.restore();
    }

    glyphTexInfo = glyphTexInfos[keys[34]];
    glyphOffset = glyphTexInfo.offset;

    ctx.save();
    ctx.translate(glyphOffset.x,glyphOffset.y);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-2,-2,4,4);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(0,0,glyphTexInfo.size.x,glyphTexInfo.size.y);
    ctx.restore();
};

TextureFont.prototype.getMetrics = function(char){
    if(!char){
        return this._fontMetrics;
    }
    var metric = this._glyphMetrics[char];
    if(metric){
        return metric;
    }
    console.log("Char not supported: " + char);
    return null;
};


TextureFont.prototype.drawString = function(){

};

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

TextureFont.loadSync = function(path) {
    var request = new XMLHttpRequest();
    request.open('HEAD', path, false);
    request.responseText = 'arraybuffer';
    request.send();
    if (request.status == 200) {
        return new TextureFont(request.responseText);
    }
    console.log('Error: Cant load Font ' + path);
    return null;
}

module.exports = TextureFont;
