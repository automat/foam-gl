var opentype = require('../../lib/opentype.js'),
    Rect = require('../geom/Rect'),
    Vec2 = require('../math/Vec2');

// Texture

function GlyphTextureInfo(){

}

function GlyphTableTexture(){

}

// Metrics

function Metrics(){
    this.rect = new Rect();
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
    this._charsSupported = Font.getSupportedCharsDefault();

    this._fontSize = this._scale = 0;
    this._font = opentype.parse(arraybuffer);
    this._fontMetrics = new FontMetrics();

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

FoTextureFontnt.prototype.getGlyph = function(char){
    var glyph = this._glyphs[char];
    if(!glyph) {
        console.log("Char not supported: " + char + '.');
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

    var font = this._font,
        fontBounds = this._fontMetrics.rect;
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
    var i,l;

    for(var c in supportedChars){
        c = supportedChars[c];
        glyph = glyphs[c] = !glyphs[c] ? font.charToGlyph(c) : glyphs[c];

        glyphXMin = glyph.xMin * scale;
        glyphYMin = glyph.yMin * scale ;
        glyphXMax = glyph.xMax * scale;
        glyphYMax = glyph.yMax * scale ;

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

        fontBounds.include(glyphBounds);

        metrics = glyphMetrics[c] = new GlyphMetrics();
        metrics.rect.set(glyphBounds);
        metrics.advanceWidth = glyph.advanceWidth * scale;
        metrics.leftSideBearing = glyph.leftSideBearing * scale;
    }
};

TextureFont.prototype.getMetrics = function(char){
    if(!char){
        return this._fontMetrics;
    }
    var metric = this._glyphMetrics[char];
    if(!metric){
        console.log("Char not supported: " + char);
        return null;
    }
    return metric;
};

TextureFont.load = function(path, callback){
    var request = new XMLHttpRequest();
    request.open('GET',path);
    request.responseType = 'arraybuffer';
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            if(request.status == 200){
                callback(new Font(request.response));
            }
        }
    };
    request.send();
};

module.exports = TextureFont;
