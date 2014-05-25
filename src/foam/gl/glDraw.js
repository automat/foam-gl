var _gl     = require('./gl'),
    glTrans = require('./glTrans'),
    Program = require('./Program');

var ArrayUtil        = require('../util/ArrayUtil'),
    ElementArrayUtil = require('../util/ElementArrayUtil');
var ObjectUtil = require('../util/ObjectUtil');

var Vec3       = require('../math/Vec3'),
    Color      = require('../util/Color'),
    Matrix44   = require('../math/Matrix44');


var DrawMode = {
    TRIANGLES : 0,
    LINES : 1,
    POINTS : 2,
    COLORED : 3
};

/*--------------------------------------------------------------------------------------------*/
//  Constructor
/*--------------------------------------------------------------------------------------------*/

function glDraw_Internal(){
    var gl = this._gl = _gl.get();

    /*--------------------------------------------------------------------------------------------*/
    //  program & attrib / uniform ref
    /*--------------------------------------------------------------------------------------------*/

    this._color = Color.white();

    this._program = null;
    this._attribLocationVertexPos = null;
    this._attribLocationVertexColor = null;
    this._attribLocationVertexNormal = null;
    this._attribLocationTexcoord = null;
    this._uniformLocationModelViewMatrix = null;
    this._uniformLocationProjectionMatrix = null;

    /*--------------------------------------------------------------------------------------------*/
    //  temps
    /*--------------------------------------------------------------------------------------------*/

    this._matrixTemp0 = new Matrix44();
    this._matrixTemp1 = new Matrix44();
    this._matrixTemp2 = new Matrix44();
    this._matrixF32   = new Float32Array(16);


    var buffer, data, num;

    /*--------------------------------------------------------------------------------------------*/
    //  Pivot
    /*--------------------------------------------------------------------------------------------*/

    this._pivotAxisLength = null;
    this._pivotHeadLength = null;
    this._pivotHeadRadius = null;

    //  vertices

    buffer = this._pivotVertexBuffer = gl.createBuffer();

    data = [    //  axes
        0,0,0,
        1,0,0,
        0,0,0,
        0,1,0,
        0,0,0,
        0,0,1
    ];

    var numHeadVertices = 16;   //  number of vertices per head

    ArrayUtil.appendArray(data, ArrayUtil.createArray(numHeadVertices,0,0,0));
    ArrayUtil.appendArray(data, ArrayUtil.createArray(numHeadVertices,0,0,0));
    ArrayUtil.appendArray(data, ArrayUtil.createArray(numHeadVertices,0,0,0));

    data = this._pivotVboVertices = new Float32Array(data);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);

    this._updatePivotGeom(1.0,0.125,0.075);

    //  colors

    this._pivotColorBuffer = gl.createBuffer();

    data = [    //  axes
        1,0,0,1,
        1,0,0,1,
        0,1,0,1,
        0,1,0,1,
        0,0,1,1,
        0,0,1,1
    ];

    ArrayUtil.appendArray(data, ArrayUtil.createArray(numHeadVertices, 1,0,0,1));
    ArrayUtil.appendArray(data, ArrayUtil.createArray(numHeadVertices, 0,1,0,1));
    ArrayUtil.appendArray(data, ArrayUtil.createArray(numHeadVertices, 0,0,1,1));

    gl.bindBuffer(gl.ARRAY_BUFFER, this._pivotColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    //  indices

    data = [];
    ArrayUtil.appendArray(data,ElementArrayUtil.genTriangleFan( 6, 6 + 16));
    ArrayUtil.appendArray(data,ElementArrayUtil.genTriangleFan(22,22 + 16));
    ArrayUtil.appendArray(data,ElementArrayUtil.genTriangleFan(38,38 + 16));
    data = new Uint16Array(data);

    buffer = this._pivotIndexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    this._pivotIndexBufferLength = data.length;


    /*--------------------------------------------------------------------------------------------*/
    //  grid
    /*--------------------------------------------------------------------------------------------*/

    this._gridVbo = gl.createBuffer();
    this._gridIbo = gl.createBuffer();

    this._gridSubdivs = null;

    this._gridVboOffsetColors = null;
    this._gridIboLength = null;


    /*--------------------------------------------------------------------------------------------*/
    //  cube
    /*--------------------------------------------------------------------------------------------*/

    //  vertices

    buffer = this._cubeVertexBuffer = gl.createBuffer();

    var len = this._cubeVertexBufferNormalOffset = 24 /*vertices*/ * 3 * 4 /*bytes*/;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, len * 2 + 24 * 2 * 4, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
        -0.5,-0.5,-0.5,
        -0.5,-0.5, 0.5,
        0.5,-0.5,-0.5,
        0.5,-0.5, 0.5,

        -0.5, 0.5,-0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5,-0.5,
        0.5, 0.5, 0.5,

        -0.5, 0.5,-0.5,
        -0.5, 0.5, 0.5,
        -0.5,-0.5,-0.5,
        -0.5,-0.5, 0.5,

        -0.5,-0.5,-0.5,
        0.5,-0.5,-0.5,
        -0.5, 0.5,-0.5,
        0.5, 0.5,-0.5,

        -0.5,-0.5, 0.5,
        0.5,-0.5, 0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,

        0.5, 0.5,-0.5,
        0.5, 0.5, 0.5,
        0.5,-0.5,-0.5,
        0.5,-0.5, 0.5
    ]));

    gl.bufferSubData(gl.ARRAY_BUFFER, len, new Float32Array([
        0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
        0,1,0,  0,1,0,  0,1,0,  0,1,0,
        -1,0,0, -1,0,0, -1,0,0, -1,0,0,
        0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
        0,0,1,  0,0,1,  0,0,1,  0,0,1,
        1,0,0,  1,0,0,  1,0,0,  1,0,0
    ]));

    len = this._cubeVertexBufferNormalTexcoord = len * 2;

    //for now
    gl.bufferSubData(gl.ARRAY_BUFFER, len, new Float32Array([
        0,0, 0.5,0, 0,0.5, 0.5,0.5,
        0,0, 0.5,0, 0,0.5, 0.5,0.5,
        0,0, 0.5,0, 0,0.5, 0.5,0.5,
        0,0, 0.5,0, 0,0.5, 0.5,0.5,
        0,0, 0.5,0, 0,0.5, 0.5,0.5,
        0,0, 0.5,0, 0,0.5, 0.5,0.5
    ]));


    //  colors

    buffer = this._cubeColorBuffer = gl.createBuffer();
    data   = this._cubeColorBufferData = new Float32Array(24 * 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);

    //  colors colored

    buffer = this._cubeColorBufferColored = gl.createBuffer();
    data   = new Float32Array([
        0, 0.5, 0, 1,
        0, 0.5, 0, 1,
        0, 0.5, 0, 1,
        0, 0.5, 0, 1,

        0, 1, 0, 1,
        0, 1, 0, 1,
        0, 1, 0, 1,
        0, 1, 0, 1,

        0.5, 0, 0, 1,
        0.5, 0, 0, 1,
        0.5, 0, 0, 1,
        0.5, 0, 0, 1,

        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,

        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,
        0, 0, 1, 1,

        1, 0, 0, 1,
        1, 0, 0, 1,
        1, 0, 0, 1,
        1, 0, 0, 1
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    //  indices

    var indicesTriangles = new Uint16Array([
        0,1,2,1,2,3,
        4,5,6,5,6,7,
        8,9,10,9,10,11,
        12,13,14,13,14,15,
        16,17,18,17,18,19,
        20,21,22,21,22,23
    ]);

    var indicesLines = new Uint16Array([
        0,1,1,3,3,2,2,0,
        4,5,5,7,7,6,6,4,
        0,4,1,5,2,6,3,7
    ]);

    var indicesPoints = new Uint16Array([
        0,1,2,3,4,5,6,7
    ]);


    this._cubeIndexBufferOffsetTriangles = 0;
    this._cubeIndexBufferOffsetLines = indicesTriangles.byteLength;
    this._cubeIndexBufferOffsetPoints = this._cubeIndexBufferOffsetLines + indicesLines.byteLength;
    this._cubeIndicesTrianglesLength = indicesTriangles.length;
    this._cubeIndicesLinesLength = indicesLines.length;
    this._cubeIndicesPointsLength = indicesPoints.length;

    buffer = this._cubeIndexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesTriangles.byteLength + indicesLines.byteLength + indicesPoints.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, this._cubeIndexBufferOffsetTriangles, indicesTriangles );
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, this._cubeIndexBufferOffsetLines, indicesLines);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, this._cubeIndexBufferOffsetPoints, indicesPoints);

    /*--------------------------------------------------------------------------------------------*/
    //  Plane
    /*--------------------------------------------------------------------------------------------*/

    buffer = this._rectBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, (4 * 3 * 3 + 4 * 2) * 4, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
        0,0,0,
        1,0,0,
        0,1,0,
        1,1,0
    ]));
    gl.bufferSubData(gl.ARRAY_BUFFER, 48, new Float32Array([
        0,0,0,
        1,0,0,
        1,1,0,
        0,1,0
    ]));
    gl.bufferSubData(gl.ARRAY_BUFFER, 96, new Float32Array([
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0
    ]));
    gl.bufferSubData(gl.ARRAY_BUFFER, 144, new Float32Array([
        0,0,1,0,0,1,1,1
    ]));

    this._rectBufferOffsetLines = 48;
    this._rectBufferOffsetNormals = 96;
    this._rectBufferOffsetTexcoords = 144;

    buffer = this._rectColorBuffer = gl.createBuffer();
    data   = this._rectColorBufferData = new Float32Array([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);

    /*--------------------------------------------------------------------------------------------*/
    //  Line
    /*--------------------------------------------------------------------------------------------*/

    buffer = this._bufferLine = gl.createBuffer();
    this._bufferLineVertex = new Float32Array(6);
    this._bufferLineColor = new Float32Array(8);
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,this._bufferLineVertex.byteLength + this._bufferLineColor.byteLength, gl.DYNAMIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER,0,this._bufferLineVertex);
    gl.bufferSubData(gl.ARRAY_BUFFER,this._bufferLineVertex.byteLength,this._bufferLineColor);

    /*--------------------------------------------------------------------------------------------*/
    //  Lines / Line strip
    /*--------------------------------------------------------------------------------------------*/

    this._bufferLineStrip = gl.createBuffer();
    this._bufferLineStripVertex = new Float32Array(0);
    this._bufferLineStripColor = new Float32Array(0);
    this._lineStripColor = new Color();

    this._bufferLines = gl.createBuffer();
    this._bufferLinesVertex = new Float32Array(0);
    this._bufferLinesColor = new Float32Array(0);
    this._linesColor = new Color();

    this._linesArrTemp = [];

    /*--------------------------------------------------------------------------------------------*/
    //  Vector
    /*--------------------------------------------------------------------------------------------*/

    this._vectorDirection = new Vec3();
    this._vectorLength = 0;

    /*--------------------------------------------------------------------------------------------*/
    //  Init
    /*--------------------------------------------------------------------------------------------*/

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

/*--------------------------------------------------------------------------------------------*/
//  Quad
/*--------------------------------------------------------------------------------------------*/



/*--------------------------------------------------------------------------------------------*/
//  Line strip
/*--------------------------------------------------------------------------------------------*/

glDraw_Internal.prototype.drawVectorf = function(x0,y0,z0,x1,y1,z1){





};

/*--------------------------------------------------------------------------------------------*/
//  Line strip
/*--------------------------------------------------------------------------------------------*/

glDraw_Internal.prototype.drawLines = function(){
    var args = arguments.length == 1 ? arguments[0] : arguments,
        arr  = this._linesArrTemp;
    var l = args.length;
    arr.length = l * 3;

    var i = -1 , i3, vec3;

    while (++i < l) {
        vec3 = args[i];
        i3   = i * 3;

        arr[i3  ] = vec3.x;
        arr[i3+1] = vec3.y;
        arr[i3+2] = vec3.z;
    }

    this.drawLinesf(arr);
};

glDraw_Internal.prototype.drawLinesf = function(lines){
    this._updateProgramLocations();

    var gl = this._gl;
    var attribLocationVertexPos    = this._attribLocationVertexPos,
        attribLocationVertexNormal = this._attribLocationVertexNormal,
        attribLocationVertexColor  = this._attribLocationVertexColor,
        attribLocationTexcoord     = this._attribLocationTexcoord;

    if(attribLocationVertexPos == -1){
        return;
    }

    if(attribLocationVertexNormal != -1){
        gl.disableVertexAttribArray(attribLocationVertexNormal);
    }
    if(attribLocationTexcoord != -1){
        gl.disableVertexAttribArray(attribLocationTexcoord);
    }

    var prevABuffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var buffer = this._bufferLines;


    if(buffer != prevABuffer){
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    }

    if(this._bufferLinesVertex.length >= lines.length){
        this._bufferLinesVertex.set(lines);

    } else {
        this._bufferLinesVertex = new Float32Array(lines);
        this._bufferLinesColor  = new Float32Array(lines.length / 3 * 4);
    }

    var vertices = this._bufferLinesVertex;
    var colors  = this._bufferLinesColor;

    gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + colors.byteLength, gl.STREAM_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

    gl.vertexAttribPointer(attribLocationVertexPos,3,gl.FLOAT,false,0,0);

    var color = this._color,
        lineColor = this._linesColor;

    if(attribLocationVertexColor != -1){
        if(!lineColor.equals(color)){
            var i = 0;
            while(i < colors.length){
                colors[i  ] = color.r;
                colors[i+1] = color.g;
                colors[i+2] = color.b;
                colors[i+3] = color.a;

                i+=4;
            }
            lineColor.set(color);
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, colors);
        gl.vertexAttribPointer(attribLocationVertexColor,4,gl.FLOAT,false,0,vertices.byteLength);
    }

    gl.uniformMatrix4fv(this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrixF32());
    gl.uniformMatrix4fv(this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrixF32());

    gl.drawArrays(gl.LINES,0,lines.length / 3);

    if(attribLocationVertexNormal != -1){
        gl.enableVertexAttribArray(attribLocationVertexNormal);
    }

    if(attribLocationTexcoord != -1){
        gl.enableVertexAttribArray(attribLocationTexcoord);
    }

    if(buffer != prevABuffer){
        gl.bindBuffer(gl.ARRAY_BUFFER, prevABuffer);
    }
};

glDraw_Internal.prototype.drawLineStripf = function(lineStrip){
    this._updateProgramLocations();

    var gl = this._gl;
    var attribLocationVertexPos    = this._attribLocationVertexPos,
        attribLocationVertexNormal = this._attribLocationVertexNormal,
        attribLocationVertexColor  = this._attribLocationVertexColor,
        attribLocationTexcoord     = this._attribLocationTexcoord;

    if(attribLocationVertexPos == -1){
        return;
    }

    if(attribLocationVertexNormal != -1){
        gl.disableVertexAttribArray(attribLocationVertexNormal);
    }
    if(attribLocationTexcoord != -1){
        gl.disableVertexAttribArray(attribLocationTexcoord);
    }

    var prevABuffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var buffer = this._bufferLineStrip;


    if(buffer != prevABuffer){
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    }

    if(this._bufferLineStripVertex.length >= lineStrip.length){
        this._bufferLineStripVertex.set(lineStrip);

    } else {
        this._bufferLineStripVertex = new Float32Array(lineStrip);
        this._bufferLineStripColor  = new Float32Array(lineStrip.length / 3 * 4);
    }

    var vertex = this._bufferLineStripVertex;
    var color  = this._bufferLineStripColor;

    gl.bufferData(gl.ARRAY_BUFFER, vertex.byteLength + color.byteLength, gl.STREAM_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._bufferLineStripVertex);

    gl.vertexAttribPointer(attribLocationVertexPos,3,gl.FLOAT,false,0,0);

    var color4f = this._color,
        lineColor4f = this._lineStripColor4f;

    if(attribLocationVertexColor != -1){
        if(lineColor4f[0] != color4f.r ||
           lineColor4f[1] != color4f.g ||
           lineColor4f[2] != color4f.b ||
           lineColor4f[3] != color4f.a){

            var i = 0;
            while(i < color.length){
                color[i  ] = color4f.r;
                color[i+1] = color4f.g;
                color[i+2] = color4f.b;
                color[i+3] = color4f.a;
                i += 4;
            }

            gl.bufferSubData(gl.ARRAY_BUFFER, vertex.byteLength, color);

            lineColor4f[0] = color4f.r;
            lineColor4f[1] = color4f.g;
            lineColor4f[2] = color4f.b;
            lineColor4f[3] = color4f.a;
        }
        gl.vertexAttribPointer(attribLocationVertexColor,4,gl.FLOAT,false,0,vertex.byteLength);
    }

    gl.uniformMatrix4fv(this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrixF32());
    gl.uniformMatrix4fv(this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrixF32());

    gl.drawArrays(gl.LINE_STRIP,0,lineStrip.length / 3);

    if(attribLocationVertexNormal != -1){
        gl.enableVertexAttribArray(attribLocationVertexNormal);
    }

    if(attribLocationTexcoord != -1){
        gl.enableVertexAttribArray(attribLocationTexcoord);
    }

    if(buffer != prevABuffer){
        gl.bindBuffer(gl.ARRAY_BUFFER, prevABuffer);
    }

};

/*--------------------------------------------------------------------------------------------*/
//  Lines
/*--------------------------------------------------------------------------------------------*/

glDraw_Internal.prototype.drawLinef = function(x0,y0,z0,x1,y1,z1){
    this._updateProgramLocations();

    var gl = this._gl;
    var attribLocationVertexPos    = this._attribLocationVertexPos,
        attribLocationVertexNormal = this._attribLocationVertexNormal,
        attribLocationVertexColor  = this._attribLocationVertexColor,
        attribLocationTexcoord     = this._attribLocationTexcoord;

    if(attribLocationVertexPos == -1){
        return;
    }

    if(attribLocationVertexNormal != -1){
        gl.disableVertexAttribArray(attribLocationVertexNormal);
    }
    if(attribLocationTexcoord != -1){
        gl.disableVertexAttribArray(attribLocationTexcoord);
    }

    var prevABuffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var buffer = this._bufferLine;

    if(buffer != prevABuffer){
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    }

    var color  = this._color,
        colors = this._bufferLineColor;

    if(attribLocationVertexColor != -1){
        if(colors[0] != color.r ||
           colors[1] != color.g ||
           colors[2] != color.b ||
           colors[3] != color.a){

            colors[0] = colors[4] = color.r;
            colors[1] = colors[5] = color.g;
            colors[2] = colors[6] = color.b;
            colors[3] = colors[7] = color.a;

            gl.bufferSubData(gl.ARRAY_BUFFER, 24, colors);
        }
        gl.vertexAttribPointer(attribLocationVertexColor,4,gl.FLOAT,false,0,24);
    }

    var vertex = this._bufferLineVertex;

    if(vertex[0] != x0 ||
       vertex[1] != y0 ||
       vertex[2] != z0 ||
       vertex[3] != x1 ||
       vertex[4] != y1 ||
       vertex[5] != z1){

        vertex[0] = x0;
        vertex[1] = y0;
        vertex[2] = z0;

        vertex[3] = x1;
        vertex[4] = y1;
        vertex[5] = z1;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertex);
    }


    gl.vertexAttribPointer(attribLocationVertexPos,3,gl.FLOAT,false,0,0);

    gl.uniformMatrix4fv(this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrixF32());
    gl.uniformMatrix4fv(this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrixF32());

    gl.drawArrays(gl.LINES,0,2);

    if(attribLocationVertexNormal != -1){
        gl.enableVertexAttribArray(attribLocationVertexNormal);
    }

    if(attribLocationTexcoord != -1){
        gl.enableVertexAttribArray(attribLocationTexcoord);
    }

    if(buffer != prevABuffer){
        gl.bindBuffer(gl.ARRAY_BUFFER, prevABuffer);
    }
};

glDraw_Internal.prototype.drawLine = function(v0,v1){
    this.drawLinef(v0.x,v0.y,v0.z,v1.x,v1.y,v1.z);
};

/*--------------------------------------------------------------------------------------------*/
//  Plane
/*--------------------------------------------------------------------------------------------*/

glDraw_Internal.prototype._drawRect_Internal = function(width,height,drawMode){
    width  = ObjectUtil.isUndefined(width) ? 1 : width;
    height = ObjectUtil.isUndefined(height) ? 1 : height;

    this._updateProgramLocations();

    var gl = this._gl;
    var attribLocationVertexPos    = this._attribLocationVertexPos,
        attribLocationVertexNormal = this._attribLocationVertexNormal,
        attribLocationVertexColor  = this._attribLocationVertexColor,
        attribLocationTexcoord     = this._attribLocationTexcoord;

    if(attribLocationVertexPos == -1){
        return;
    }

    var prevABuffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var prevEBuffer = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);

    var color4f = this._color,
        color   = this._rectColorBufferData;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._rectBuffer);

    gl.vertexAttribPointer(attribLocationVertexPos,3,gl.FLOAT,false,0,
        drawMode == DrawMode.LINES ? this._rectBufferOffsetLines : 0);


    if(drawMode == DrawMode.TRIANGLES){
        if(attribLocationVertexNormal != -1){
            gl.vertexAttribPointer(attribLocationVertexNormal,4,gl.FLOAT,false,0,this._rectBufferOffsetNormals);
        }
        if(attribLocationTexcoord != -1){
            gl.vertexAttribPointer(attribLocationTexcoord,2,gl.FLOAT,false,0,this._rectBufferOffsetTexcoords);
        }
    } else {
        if(attribLocationVertexNormal != -1){
            gl.disableVertexAttribArray(attribLocationVertexNormal);
        }
        if(attribLocationTexcoord != -1){
            gl.disableVertexAttribArray(attribLocationTexcoord);
        }
    }

    if(attribLocationVertexColor != -1){
        gl.bindBuffer(gl.ARRAY_BUFFER, this._rectColorBuffer);
        if( color[0] != color4f[0] ||
            color[1] != color4f[1] ||
            color[2] != color4f[2] ||
            color[3] != color4f[3]){

            color[0] = color[4] = color[ 8] = color[12] = color4f[0];
            color[1] = color[5] = color[ 9] = color[13] = color4f[1];
            color[2] = color[6] = color[10] = color[14] = color4f[2];
            color[3] = color[7] = color[11] = color[15] = color4f[3];

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, color);
        }
        gl.vertexAttribPointer(attribLocationVertexColor,4,gl.FLOAT,false,0,0);
    }

    glTrans.pushMatrix();
    glTrans.scale3f(width,height,1.0);

    gl.uniformMatrix4fv(this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrixF32());
    gl.uniformMatrix4fv(this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrixF32());

    gl.drawArrays(drawMode == DrawMode.TRIANGLES ? gl.TRIANGLE_STRIP :
                  drawMode == DrawMode.LINES ? gl.LINE_LOOP : gl.POINTS,0,4);

    glTrans.popMatrix();

    if(drawMode != DrawMode.TRIANGLES){
        if(attribLocationVertexNormal != -1){
            gl.enableVertexAttribArray(attribLocationVertexNormal);
        }
        if(attribLocationTexcoord != -1){
            gl.enableVertexAttribArray(attribLocationTexcoord);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,prevABuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,prevEBuffer);
};

glDraw_Internal.prototype.drawRect = function(width,height){
    this._drawRect_Internal(width,height,DrawMode.TRIANGLES);
};

glDraw_Internal.prototype.drawRectPoints = function(width,height){
    this._drawRect_Internal(width,height,DrawMode.POINTS);
};

glDraw_Internal.prototype.drawRectStroked = function(width,height){
    this._drawRect_Internal(width,height,DrawMode.LINES);
};


/*--------------------------------------------------------------------------------------------*/
//  Cube
/*--------------------------------------------------------------------------------------------*/

glDraw_Internal.prototype._updateCubeGeom = function(){
    var color4f = this._color,
        color   = this._cubeColorBufferData;

    if( color[0] == color4f[0] &&
        color[1] == color4f[1] &&
        color[2] == color4f[2] &&
        color[3] == color4f[3]){
        return;
    }

    ArrayUtil.fillArrayObj4(color,0,color4f);

    var gl = this._gl;
    gl.bufferSubData(gl.ARRAY_BUFFER,0,color);
};

glDraw_Internal.prototype._drawCube_Internal = function(size,drawMode){
    size = ObjectUtil.isUndefined(size) ? 1.0 : size < 0 ? 0 : size;

    this._updateProgramLocations();

    var attribLocationVertexPos    = this._attribLocationVertexPos,
        attribLocationVertexNormal = this._attribLocationVertexNormal,
        attribLocationVertexColor  = this._attribLocationVertexColor,
        attribLocationTexcoord     = this._attribLocationTexcoord;


    if(attribLocationVertexPos == -1){
        return;
    }

    var gl = this._gl;
    var prevABuffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var prevEBuffer = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);


    gl.bindBuffer(gl.ARRAY_BUFFER, this._cubeVertexBuffer);
    gl.vertexAttribPointer(attribLocationVertexPos , 3, gl.FLOAT, false, 0, 0);

    if((drawMode == DrawMode.TRIANGLES || drawMode == DrawMode.COLORED) &&
       attribLocationVertexNormal != -1){
        gl.vertexAttribPointer(attribLocationVertexNormal , 3, gl.FLOAT, false, 0, this._cubeVertexBufferNormalOffset);
    }

    if(attribLocationTexcoord != -1){
        if(drawMode == DrawMode.TRIANGLES){
            gl.vertexAttribPointer(attribLocationTexcoord, 2, gl.FLOAT, false, 0, this._cubeVertexBufferNormalTexcoord);
        } else {
            gl.disableVertexAttribArray(attribLocationTexcoord);
        }
    }


    if(attribLocationVertexColor != -1){
        if(drawMode != DrawMode.COLORED){
            gl.bindBuffer(gl.ARRAY_BUFFER, this._cubeColorBuffer);
            this._updateCubeGeom();
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this._cubeColorBufferColored);
        }
        gl.vertexAttribPointer(attribLocationVertexColor, 4, gl.FLOAT, false, 0, 0);
    } else {
        gl.disableVertexAttribArray(attribLocationVertexColor);
    }

    glTrans.pushMatrix();
    if(size != 1){
        glTrans.scale3f(size,size,size);
    }

    gl.uniformMatrix4fv(this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrixF32());
    gl.uniformMatrix4fv(this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrixF32());

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this._cubeIndexBuffer);
    switch(drawMode){
        case DrawMode.TRIANGLES:
            gl.drawElements(gl.TRIANGLES,this._cubeIndicesTrianglesLength,gl.UNSIGNED_SHORT,0);
            break;
        case DrawMode.LINES:
            gl.drawElements(gl.LINES,this._cubeIndicesLinesLength,gl.UNSIGNED_SHORT,this._cubeIndexBufferOffsetLines);
            break;
        case DrawMode.POINTS:
            gl.drawElements(gl.POINTS,this._cubeIndicesPointsLength,gl.UNSIGNED_SHORT,this._cubeIndexBufferOffsetPoints);
            break;
        case DrawMode.COLORED:
            gl.drawElements(gl.TRIANGLES,this._cubeIndicesTrianglesLength,gl.UNSIGNED_SHORT,0);
            break;
    }

    if(attribLocationTexcoord != -1 && drawMode != DrawMode.TRIANGLES){
        gl.enableVertexAttribArray(attribLocationTexcoord);
    }

    glTrans.popMatrix();

    gl.bindBuffer(gl.ARRAY_BUFFER,prevABuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,prevEBuffer);
};

glDraw_Internal.prototype.drawCube = function(size){
    this._drawCube_Internal(size, DrawMode.TRIANGLES);
};

glDraw_Internal.prototype.drawCubePoints = function(size){
    this._drawCube_Internal(size, DrawMode.POINTS);
};

glDraw_Internal.prototype.drawCubeStroked = function(size){
    this._drawCube_Internal(size, DrawMode.LINES);
};

glDraw_Internal.prototype.drawCubeColored = function(size){
    this._drawCube_Internal(size, DrawMode.COLORED);
};


/*--------------------------------------------------------------------------------------------*/
//  Grid
/*--------------------------------------------------------------------------------------------*/


glDraw_Internal.prototype._updateGridGeom = function(subdivs){
    if(this._gridSubdivs == subdivs){
        return;
    }
    var gl = this._gl;

    var subdivs1 = subdivs + 1,
        num      = subdivs1 * subdivs1;

    var i, j, k;
    var vertices = new Float32Array(num * 3);
    var colors   = new Float32Array(ArrayUtil.createArray(num,1,1,1,1));

    var step = 1.0 / (subdivs1 - 1);

    i = -1;
    while(++i < subdivs1){
        j = -1;
        while(++j < subdivs1){
            k = (i * subdivs1 + j) * 3;
            vertices[k  ] = -0.5 + step * j;
            vertices[k+1] = 0;
            vertices[k+2] = -0.5 + step * i;
        }
    }

    var indices = [];

    i = -1;
    while(++i < subdivs1){
        j = -1;
        while(++j < subdivs1){
            if(j < subdivs){
                k = i * subdivs1 + j;
                indices.push(k);
                indices.push(k+1);
            }
            if(i < subdivs){
                k = i * subdivs1 + j;
                indices.push(k);
                indices.push(k+subdivs1);
            }
        }
    }

    indices = new Uint16Array(indices);

    gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength + colors.byteLength, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
    gl.bufferSubData(gl.ARRAY_BUFFER, vertices.byteLength, colors);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    this._gridVboOffsetColors = vertices.byteLength;
    this._gridSubdivs = subdivs;

    this._gridIboLength = indices.length;
};


glDraw_Internal.prototype.drawGrid = function(size, subdivs){
    size    = ObjectUtil.isUndefined(size)    ? 1.0 : (size < 0) ? 0.0 : size;
    subdivs = ObjectUtil.isUndefined(subdivs) ? 1.0 : (subdivs < 0) ? 0 : subdivs;

    var gl = this._gl;
    this._updateProgramLocations();

    var attribLocationVertexPos   = this._attribLocationVertexPos,
        attribLocationVertexColor = this._attribLocationVertexColor,
        attribLocationTexcoord    = this._attribLocationTexcoord;

    if(attribLocationVertexPos == -1){
        return;
    }
    if(attribLocationTexcoord != -1){
        gl.disableVertexAttribArray(attribLocationTexcoord);
    }

    var prevVbo = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var prevIbo = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
    var vbo = this._gridVbo;
    var ibo = this._gridIbo;

    glTrans.pushMatrix();
    glTrans.scale3f(size,1.0,size);

    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);

    this._updateGridGeom(subdivs);

    gl.vertexAttribPointer(this._attribLocationVertexPos , 3, gl.FLOAT, false, 0, 0);
    if(attribLocationVertexColor != -1){
        gl.vertexAttribPointer(this._attribLocationVertexColor, 4, gl.FLOAT, false, 0, this._gridVboOffsetColors);
    }
    gl.uniformMatrix4fv(   this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrixF32());
    gl.uniformMatrix4fv(   this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrixF32());

    gl.drawElements(gl.LINES,this._gridIboLength,gl.UNSIGNED_SHORT,0);

    glTrans.popMatrix();

    if(attribLocationTexcoord != -1){
        gl.enableVertexAttribArray(attribLocationTexcoord);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,prevVbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,prevIbo);
};


/*--------------------------------------------------------------------------------------------*/
// Pivot
/*--------------------------------------------------------------------------------------------*/

glDraw_Internal.prototype._updatePivotGeom = function(axisLength, headLength, headRadius){
    if(this._pivotAxisLength == axisLength &&
        this._pivotHeadLength == headLength &&
        this._pivotHeadRadius == headRadius){
        return;
    }

    var axis_head_length = axisLength - headLength;

    var gl       = this._gl;
    var vertices = this._pivotVboVertices;

    var i,l;

    vertices[3]  = axisLength;
    vertices[10] = axisLength;
    vertices[17] = axisLength;

    var numVertices = 48;

    var offsetHeadX = 18;
    var offsetHeadY = offsetHeadX + numVertices;
    var offsetHeadZ = offsetHeadY + numVertices;

    this._genHead(headLength,headRadius,vertices,offsetHeadX);
    this._genHead(headLength,headRadius,vertices,offsetHeadY);
    this._genHead(headLength,headRadius,vertices,offsetHeadZ);

    var pi_2 = Math.PI * 0.5;

    var matrix0 = this._matrixTemp0;
    var matrix1 = this._matrixTemp1;
    var matrix2 = this._matrixTemp2;

    //  x

    matrix0.identity();
    matrix1.identity();
    matrix2.identity();

    var transX = Matrix44.createRotation(0,-pi_2,0,matrix0).multiplied(
                 Matrix44.createTranslation(axis_head_length,0,0,matrix1),
                 matrix2);

    i = offsetHeadX;
    l = i + numVertices;
    while(i < l){
        transX.multVec3AI(vertices,i);
        i += 3;
    }

    //  y

    matrix0.identity();
    matrix1.identity();
    matrix2.identity();

    var transY = Matrix44.createRotation( pi_2, 0, 0, matrix0).multiplied(
                 Matrix44.createTranslation(0,axis_head_length,0, matrix1),
                 matrix2);

    i = offsetHeadY;
    l = i + numVertices;
    while(i < l){
        transY.multVec3AI(vertices,i);
        i += 3;
    }

    //  z

    matrix0.identity();

    var transZ = Matrix44.createTranslation(0,0,axis_head_length,matrix0);

    i = offsetHeadZ;
    l = i + numVertices;
    while(i < l){
        transZ.multVec3AI(vertices,i);
        i += 3;
    }

    //  push

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);

    this._pivotAxisLength = axisLength;
    this._pivotHeadLength = headLength;
    this._pivotHeadRadius = headRadius;
};


glDraw_Internal.prototype.drawPivot = function(axisLength, headLength, headRadius){
    axisLength = ObjectUtil.isUndefined(axisLength) ? 1.0   : axisLength;
    headLength = ObjectUtil.isUndefined(headLength) ? 0.125 : headLength;
    headRadius = ObjectUtil.isUndefined(headRadius) ? 0.075 : headRadius;

    var gl = this._gl;
    this._updateProgramLocations();

    var attribLocationVertexPos   = this._attribLocationVertexPos,
        attribLocationVertexColor = this._attribLocationVertexColor,
        attribLocationTexcoord    = this._attribLocationTexcoord;
    if(attribLocationVertexPos == -1){
        return;
    }
    if(attribLocationTexcoord != -1){
        gl.disableVertexAttribArray(attribLocationTexcoord);
    }

    var prevVbo = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var prevIbo = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
    var vbo = this._pivotVertexBuffer;
    var ibo = this._pivotIndexBuffer;

    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);

    this._updatePivotGeom(axisLength,headLength,headRadius);

    gl.vertexAttribPointer(this._attribLocationVertexPos , 3, gl.FLOAT, false, 0, 0);

    if(attribLocationVertexColor != -1){
        gl.bindBuffer(gl.ARRAY_BUFFER,this._pivotColorBuffer);
        gl.vertexAttribPointer(this._attribLocationVertexColor, 4, gl.FLOAT, false, 0,0);
    }

    gl.uniformMatrix4fv(   this._uniformLocationModelViewMatrix , false, glTrans.getModelViewMatrixF32());
    gl.uniformMatrix4fv(   this._uniformLocationProjectionMatrix, false, glTrans.getProjectionMatrixF32());

    gl.drawArrays(gl.LINES,0,6);
    gl.drawElements(gl.TRIANGLES,this._pivotIndexBufferLength,gl.UNSIGNED_SHORT,0);

    if(attribLocationTexcoord != -1){
        gl.enableVertexAttribArray(attribLocationTexcoord);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,prevVbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, prevIbo);
};

/*--------------------------------------------------------------------------------------------*/
//  Helper
/*--------------------------------------------------------------------------------------------*/

glDraw_Internal.prototype._genHead = function(length, radius, arr, offset){
    offset = !offset ? 0 : offset;

    var numSteps = 15;
    var step = (Math.PI * 2) / (numSteps - 1);
    var angle;

    arr[offset++] = 0;
    arr[offset++] = 0;
    arr[offset++] = length;

    numSteps *= 3;
    numSteps  = offset + numSteps;
    var i = offset;
    var j = 0;
    while(i < numSteps){
        angle = step * j++;

        arr[i  ] = Math.cos(angle) * radius;
        arr[i+1] = Math.sin(angle) * radius;
        arr[i+2] = 0;

        i += 3;
    }
};

glDraw_Internal.prototype._genTube = function(length, radius, arr, offset){
    offset = offset || 0;

    var numSteps = 15;
    var step = (Math.PI * 2) / (numSteps - 1);
    var angle;

    numSteps  = offset + numSteps;
    var i = offset;
    var j = 0;
    while(i < numSteps){
        angle = step * j++;

        arr[i  ] = arr[i+3] = Math.cos(angle) * radius;
        arr[i+1] = arr[i+4] = Math.sin(angle) * radius;
        arr[i+2] = 0;
        arr[i+5] = length;

        i += 6;
    }
};

glDraw_Internal.prototype._updateProgramLocations = function(){
    var gl = this._gl;
    var program = gl.getParameter(gl.CURRENT_PROGRAM);

    if(this._program == program){
        return;
    }

    this._attribLocationVertexPos         = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_POSITION);
    this._attribLocationVertexColor       = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_COLOR);
    this._attribLocationVertexNormal      = gl.getAttribLocation(program,Program.ATTRIB_VERTEX_NORMAL);
    this._attribLocationTexcoord          = gl.getAttribLocation(program,Program.ATTRIB_TEXCOORD);
    this._uniformLocationModelViewMatrix  = gl.getUniformLocation(program,Program.UNIFORM_MODELVIEW_MATRIX);
    this._uniformLocationProjectionMatrix = gl.getUniformLocation(program,Program.UNIFORM_PROJECTION_MATRIX);

    this._program = program;
};


glDraw_Internal.prototype.colorf = function(r,g,b,a){
    this._color.setf(r, g || 0, b || 0, a || 1);
};

glDraw_Internal.prototype.color = function(color){
    this._color.set(color);
};


glDraw_Internal.prototype.drawTexture = function(x0,y0,x1,y1){

};


glDraw_Internal.prototype.getColor = function(color){
    return (color || new Color()).set(this._color);
};


/*

 glDraw.drawLine = function(start, end){
 };


 glDraw.drawSphere = function(center, radius, numSegs){};
 glDraw.drawCircle = function(center,radius,numSegs){};
 glDraw.drawCircleStroked = function(center,radius,numSegs){};
 glDraw.drawEllipse = function(center,radiusX,radiusY,numSegs){};
 glDraw.drawEllipseStroked = function(center,radiusX,radiusY,numSegs){};
 glDraw.drawRect = function(rect){};
 glDraw.drawRectStroked = function(rect){};
 glDraw.drawRectRounded = function(rect,radiusCorner,numSegsCorner){};
 glDraw.drawRectRoundedStroked  =function(rect,radiusCorner,numSegsCorner){};
 glDraw.drawTriangle = function(v0,v1,v2){};
 glDraw.drawTriangleStroked = function(v0,v1,v2){};

 glDraw.draw = function(obj){};

*/
var glDraw = {
    _obj : null,

    init : function(){
        this._obj = new glDraw_Internal();
    },
    get : function(){
        return this._obj;
    }
};

module.exports = glDraw;