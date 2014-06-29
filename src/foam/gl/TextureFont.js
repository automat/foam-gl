var opentype = require('../../lib/opentype.js'),
    Rect = require('../geom/Rect'),
    Vec2 = require('../math/Vec2'),
    _gl = require('./gl'),
    ObjectUtil = require('../util/ObjectUtil'),
    fMath = require('../math/Math');

var GLYPH_PADDING = 2;

function rectPath(ctx,rect){
    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.beginPath();
    ctx.arc(rect.min.x,rect.min.y,3,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rect.min.x,rect.min.y);
    ctx.lineTo(rect.max.x,rect.min.y);
    ctx.lineTo(rect.max.x,rect.max.y);
    ctx.lineTo(rect.min.x,rect.max.y);
    ctx.lineTo(rect.min.x,rect.min.y);
    ctx.closePath();
}

function lineVPath(ctx,min,max,val){
    ctx.beginPath();
    ctx.moveTo(min,val);
    ctx.lineTo(max,val);
    ctx.closePath();
}

function drawChar(ctx,font,char) {
    var fm = font.getMetrics();
    var cm = font.getMetrics(char);

    ctx.save();
    ctx.translate(-cm.bounds.min.x, -cm.bounds.min.y);


    ctx.strokeStyle = '#000';
    lineVPath(ctx,0);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(0,0,255)';
    lineVPath(ctx,cm.bounds.min.x,cm.bounds.max.x,-fm.ascent);
    lineVPath(ctx,cm.bounds.min.x,cm.bounds.max.x,-fm.descent);
    ctx.stroke();


    //x min/max
    ctx.strokeStyle = 'rgb(0,255,255)';
    rectPath(ctx,cm.bounds);
    ctx.stroke();

    /*
    ctx.strokeStyle = 'rgb(0,255,0)';
    rectPath(ctx,fm.bounds);
    ctx.stroke();
    */
    font.getGlyph(char).draw(ctx,0,0,font.getFontSize());
    //glyph.drawMetrics(ctx,0,0,fontSize);

    ctx.restore();
}

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
        glyphBounds = new Rect();

    var scale = this._scale;
    var glyph, metrics;
    var glyphXMin, glyphXMax,
        glyphYMin, glyphYMax;
    var glyphPathCmds,
        glyphPathCmd;
    var glyphPoints = [];
    var glyphMaxSize = Vec2.min();

    var key, i, l;

    for(var k in keys){
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
        metrics.advanceWidth = glyph.advanceWidth * scale;
        metrics.leftSideBearing = glyph.leftSideBearing * scale;
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
        glyphOffsetYBase = glyphMetrics[keys[0]].bounds.getHeight(),
        glyphSize;

    i = -1;
    l = keys.length;

    while(++i < l){
        key = keys[i];
        metrics = glyphMetrics[key];
        glyphSize = metrics.bounds.getSize();

        if((glyphOffset.x + glyphSize.x) >= canvasWidthMax){
            glyphOffset.x = 0;
            glyphOffset.y += glyphOffsetYBase;
            glyphOffsetYBase = glyphSize.y;
        }

        glyphTexInfo = glyphTexInfos[key] = new GlyphTextureInfo();
        glyphTexInfo.offset.set(glyphOffset);
        glyphTexInfo.size.set(glyphSize);

        glyphOffset.x += glyphSize.x;
        canvasSize.x = Math.max(glyphOffset.x, canvasSize.x);
        canvasSize.y = Math.max(glyphOffset.y, canvasSize.y);
    }

    canvas.width = canvasSize.x + 200;
    canvas.height = canvasSize.y + glyphOffsetYBase;

    ctx.fillStyle = 'rgb(255,0,0)';
    rectPath(ctx,new Rect(canvasSize.x, canvas.height));
    ctx.fill();

    i = -1;
    while(++i < l){
        key = keys[i];

        glyphTexInfo = glyphTexInfos[key];
        glyphOffset = glyphTexInfo.offset;
        glyphSize = glyphTexInfo.size;

        ctx.save();
        ctx.translate(glyphOffset.x,glyphOffset.y);
        drawChar(ctx,this,key);
        ctx.restore();
    }
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
