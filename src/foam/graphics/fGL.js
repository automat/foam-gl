var fError   = require('../system/common/fError'),
    Platform = require('../system/common/fPlatform'),
    Flags    = require('../system/fFlags'),
    Program  = require('./gl/fProgram'),
    System   = require('../system/fSystem'),
    Shared   = require('../system/fShared'),

    ProgVertShaderGLSL       = require('./gl/shader/fProgVertShader'),
    ProgFragShaderGLSL       = require('./gl/shader/fProgFragShader'),

    ColorVertShaderGLSL      = require('./gl/shader/fColorVertShader'),
    ColorFragShaderGLSL      = require('./gl/shader/fColorFragShader'),
    ColorSolidVertShaderGLSL = require('./gl/shader/fColorSolidVertShader'),
    ColorSolidFragShaderGLSL = require('./gl/shader/fColorSolidFragShader'),
    NormalVertShaderGLSL     = require('./gl/shader/fNormalVertShader'),
    NormalFragShaderGLSL     = require('./gl/shader/fNormalFragShader'),

    BillboardVertShaderGLSL = require('./gl/shader/fBillboardVertShader'),
    BillboardFragShaderGLSL = require('./gl/shader/fBillboardFragShader'),
    ImageVertShaderGLSL     = require('./gl/shader/fImageVertShader'),
    ImageFragShaderGLSL     = require('./gl/shader/fImageFragShader'),

    Vec2          = require('../math/fVec2'),
    Vec3          = require('../math/fVec3'),
    Vec4          = require('../math/fVec4'),
    Mat33         = require('../math/fMat33'),
    Mat44         = require('../math/fMat44'),
    Color         = require('../util/fColor'),
    Texture       = require('./gl/texture/fTexture'),
    CanvasTexture = require('./gl/texture/fCanvasTexture'),

    Util = require('../util/fUtil');


function FGL(context3d,context2d)
{
    /*---------------------------------------------------------------------------------------------------------*/
    // Init
    /*---------------------------------------------------------------------------------------------------------*/

    var gl = this.gl = context3d;

    /*---------------------------------------------------------------------------------------------------------*/
    // create shaders/program + bind
    /*---------------------------------------------------------------------------------------------------------*/

    var platform = Platform.getTarget();

    this._programMaterialColor      = new Program(this,ColorVertShaderGLSL,ColorFragShaderGLSL);
    this._programMaterialColorSolid = new Program(this,ColorSolidVertShaderGLSL,ColorSolidFragShaderGLSL);
    this._programMaterialNormal     = new Program(this,NormalVertShaderGLSL,NormalFragShaderGLSL);
    this._programRenderBillboard    = new Program(this,BillboardVertShaderGLSL,BillboardFragShaderGLSL);
    this._programRenderImage        = new Program(this,ImageVertShaderGLSL,ImageFragShaderGLSL);
    this._programDefault            = new Program(this,ProgVertShaderGLSL,ProgFragShaderGLSL);

    this._cprogram     = null;
    this._cprogramLast = null;

    //
    Flags.__uintTypeAvailable = platform == Platform.PLASK || gl.getExtension('OES_element_index_uint');
    //...


    /*---------------------------------------------------------------------------------------------------------*/
    // Set cross material shader initial values
    /*---------------------------------------------------------------------------------------------------------*/

    this.MATERIAL_MODE_COLOR        = 0;
    this.MATERIAL_MODE_COLOR_SOLID  = 1;
    this.MATERIAL_MODE_NORMAL       = 2;
    this.MATERIAL_MODE_PHONG        = 3;
    this.MATERIAL_MODEL_ANTISOPTRIC = 4;
    this.MATERIAL_MODEL_FRESNEL     = 5;
    this.MATERIAL_MODEL_BLINN       = 6;
    this.MATERIAL_MODEL_FLAT        = 7;

    this._materialMode     = 3;
    this._materialModeLast = -1;

    //Material Initial Shader Vals

    //this._uMaterialEmmision = new Float32Array([0.0,0.0,0.0,1.0]);
    this._uMaterialAmbient  = new Float32Array([1.0,0.5,0.5,1.0]);
    this._uMaterialDiffuse  = new Float32Array([0.0,0.0,0.0,1.0]);
    this._uMaterialSpecular = new Float32Array([0.0,0.0,0.0,1.0]);
    this._uMaterialShniness = 10.0;


    /*---------------------------------------------------------------------------------------------------------*/
    // Set cross light shader initial values
    /*---------------------------------------------------------------------------------------------------------*/

    this.MAX_LIGHTS = 8;

    this.LIGHT_0    = 0;
    this.LIGHT_1    = 1;
    this.LIGHT_2    = 2;
    this.LIGHT_3    = 3;
    this.LIGHT_4    = 4;
    this.LIGHT_5    = 5;
    this.LIGHT_6    = 6;
    this.LIGHT_7    = 7;

    var uLights = this._uLights = new Array(this.MAX_LIGHTS);
    var i = -1, l = uLights.length;

    while(++i < l)
    {
        uLights[i] =
        [
            new Float32Array([0,0,0,0]), //position
            new Float32Array([0,0,0]),   //ambient
            new Float32Array([0,0,0]),   //diffuse
            new Float32Array([0,0,0]),
            1.0,    //constantAttenuation
            0.0,    //linearAttenuation
            0.0     //quadraticAttenuation
        ]
    }


    /*---------------------------------------------------------------------------------------------------------*/
    // Shared uniforms
    /*---------------------------------------------------------------------------------------------------------*/

    this._uAmbient   = Vec3.make();
    this._uPointSize = 1.0;


    /*---------------------------------------------------------------------------------------------------------*/
    // Temps
    /*---------------------------------------------------------------------------------------------------------*/

    this._vTemp0  = Vec4.make();
    this._vZero3f = Vec3.make();

    this._mTemp0 = Mat44.make();
    this._mTemp1 = Mat44.make();
    this._mTemp2 = Mat44.make();


    /*---------------------------------------------------------------------------------------------------------*/
    // Bind constants
    /*---------------------------------------------------------------------------------------------------------*/

    this.ACTIVE_ATTRIBUTES= 35721; this.ACTIVE_TEXTURE= 34016; this.ACTIVE_UNIFORMS= 35718; this.ALIASED_LINE_WIDTH_RANGE= 33902; this.ALIASED_POINT_SIZE_RANGE= 33901; this.ALPHA= 6406; this.ALPHA_BITS= 3413; this.ALWAYS= 519 ; this.ARRAY_BUFFER= 34962 ; this.ARRAY_BUFFER_BINDING= 34964 ; this.ATTACHED_SHADERS= 35717 ; this.BACK= 1029 ; this.BLEND= 3042 ; this.BLEND_COLOR= 32773 ; this.BLEND_DST_ALPHA= 32970 ; this.BLEND_DST_RGB= 32968 ; this.BLEND_EQUATION= 32777 ; this.BLEND_EQUATION_ALPHA= 34877 ; this.BLEND_EQUATION_RGB= 32777 ; this.BLEND_SRC_ALPHA= 32971 ; this.BLEND_SRC_RGB= 32969 ; this.BLUE_BITS= 3412 ; this.BOOL= 35670 ; this.BOOL_VEC2= 35671 ; this.BOOL_VEC3= 35672 ; this.BOOL_VEC4= 35673 ; this.BROWSER_DEFAULT_WEBGL= 37444 ; this.BUFFER_SIZE= 34660 ; this.BUFFER_USAGE= 34661 ; this.BYTE= 5120 ; this.CCW= 2305 ; this.CLAMP_TO_EDGE= 33071 ; this.COLOR_ATTACHMENT0= 36064 ; this.COLOR_BUFFER_BIT= 16384 ; this.COLOR_CLEAR_VALUE= 3106 ; this.COLOR_WRITEMASK= 3107 ; this.COMPILE_STATUS= 35713 ; this.COMPRESSED_TEXTURE_FORMATS= 34467 ; this.CONSTANT_ALPHA= 32771 ; this.CONSTANT_COLOR= 32769 ; this.CONTEXT_LOST_WEBGL= 37442 ; this.CULL_FACE= 2884 ; this.CULL_FACE_MODE= 2885 ; this.CURRENT_PROGRAM= 35725 ; this.CURRENT_VERTEX_ATTRIB= 34342 ; this.CW= 2304 ; this.DECR= 7683 ; this.DECR_WRAP= 34056 ; this.DELETE_STATUS= 35712 ; this.DEPTH_ATTACHMENT= 36096 ; this.DEPTH_BITS= 3414 ; this.DEPTH_BUFFER_BIT= 256 ; this.DEPTH_CLEAR_VALUE= 2931 ; this.DEPTH_COMPONENT= 6402 ; this.DEPTH_COMPONENT16= 33189 ; this.DEPTH_FUNC= 2932 ; this.DEPTH_RANGE= 2928 ; this.DEPTH_STENCIL= 34041 ; this.DEPTH_STENCIL_ATTACHMENT= 33306 ; this.DEPTH_TEST= 2929 ; this.DEPTH_WRITEMASK= 2930 ; this.DITHER= 3024 ; this.DONT_CARE= 4352 ; this.DST_ALPHA= 772 ; this.DST_COLOR= 774 ; this.DYNAMIC_DRAW= 35048 ; this.ELEMENT_ARRAY_BUFFER= 34963 ; this.ELEMENT_ARRAY_BUFFER_BINDING= 34965 ; this.EQUAL= 514 ; this.FASTEST= 4353 ; this.FLOAT= 5126 ; this.FLOAT_MAT2= 35674 ; this.FLOAT_MAT3= 35675 ; this.FLOAT_MAT4= 35676 ; this.FLOAT_VEC2= 35664 ; this.FLOAT_VEC3= 35665 ; this.FLOAT_VEC4= 35666 ; this.FRAGMENT_SHADER= 35632 ; this.FRAMEBUFFER= 36160 ; this.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME= 36049 ; this.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE= 36048 ; this.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE= 36051 ; this.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL= 36050 ; this.FRAMEBUFFER_BINDING= 36006 ; this.FRAMEBUFFER_COMPLETE= 36053 ; this.FRAMEBUFFER_INCOMPLETE_ATTACHMENT= 36054 ; this.FRAMEBUFFER_INCOMPLETE_DIMENSIONS= 36057 ; this.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT= 36055 ; this.FRAMEBUFFER_UNSUPPORTED= 36061 ; this.FRONT= 1028 ; this.FRONT_AND_BACK= 1032 ; this.FRONT_FACE= 2886 ; this.FUNC_ADD= 32774 ; this.FUNC_REVERSE_SUBTRACT= 32779 ; this.FUNC_SUBTRACT= 32778 ; this.GENERATE_MIPMAP_HINT= 33170 ; this.GEQUAL= 518 ; this.GREATER= 516 ; this.GREEN_BITS= 3411 ; this.HIGH_FLOAT= 36338 ; this.HIGH_INT= 36341 ; this.INCR= 7682 ; this.INCR_WRAP= 34055 ; this.INT= 5124 ; this.INT_VEC2= 35667 ; this.INT_VEC3= 35668 ; this.INT_VEC4= 35669 ; this.INVALID_ENUM= 1280 ; this.INVALID_FRAMEBUFFER_OPERATION= 1286 ; this.INVALID_OPERATION= 1282 ; this.INVALID_VALUE= 1281 ; this.INVERT= 5386 ; this.KEEP= 7680 ; this.LEQUAL= 515 ; this.LESS= 513 ; this.LINEAR= 9729 ; this.LINEAR_MIPMAP_LINEAR= 9987 ; this.LINEAR_MIPMAP_NEAREST= 9985 ; this.LINES= 1 ; this.LINE_LOOP= 2 ; this.LINE_STRIP= 3 ; this.LINE_WIDTH= 2849; this.LINK_STATUS= 35714; this.LOW_FLOAT= 36336 ; this.LOW_INT= 36339 ; this.LUMINANCE= 6409 ; this.LUMINANCE_ALPHA= 6410; this.MAX_COMBINED_TEXTURE_IMAGE_UNITS= 35661 ; this.MAX_CUBE_MAP_TEXTURE_SIZE= 34076 ; this.MAX_FRAGMENT_UNIFORM_VECTORS= 36349 ; this.MAX_RENDERBUFFER_SIZE= 34024 ; this.MAX_TEXTURE_IMAGE_UNITS= 34930 ; this.MAX_TEXTURE_SIZE= 3379 ; this. MAX_VARYING_VECTORS= 36348 ; this.MAX_VERTEX_ATTRIBS= 34921 ; this.MAX_VERTEX_TEXTURE_IMAGE_UNITS= 35660 ; this.MAX_VERTEX_UNIFORM_VECTORS= 36347 ; this.MAX_VIEWPORT_DIMS= 3386 ; this.MEDIUM_FLOAT= 36337 ; this.MEDIUM_INT= 36340 ; this.MIRRORED_REPEAT= 33648 ; this.NEAREST= 9728 ; this.NEAREST_MIPMAP_LINEAR= 9986 ; this.NEAREST_MIPMAP_NEAREST= 9984 ; this.NEVER= 512 ; this.NICEST= 4354 ; this.NONE= 0 ; this.NOTEQUAL= 517 ; this.NO_ERROR= 0 ; this.ONE= 1 ; this.ONE_MINUS_CONSTANT_ALPHA= 32772 ; this.ONE_MINUS_CONSTANT_COLOR= 32770 ; this.ONE_MINUS_DST_ALPHA= 773 ; this.ONE_MINUS_DST_COLOR= 775 ; this.ONE_MINUS_SRC_ALPHA= 771 ; this.ONE_MINUS_SRC_COLOR= 769 ; this.OUT_OF_MEMORY= 1285 ; this.PACK_ALIGNMENT= 3333 ; this.POINTS= 0 ; this.POLYGON_OFFSET_FACTOR= 32824 ; this.POLYGON_OFFSET_FILL= 32823 ; this.POLYGON_OFFSET_UNITS= 10752 ; this.RED_BITS= 3410 ; this.RENDERBUFFER= 36161 ; this.RENDERBUFFER_ALPHA_SIZE= 36179 ; this.RENDERBUFFER_BINDING= 36007 ; this.RENDERBUFFER_BLUE_SIZE= 36178 ; this.RENDERBUFFER_DEPTH_SIZE= 36180 ; this.RENDERBUFFER_GREEN_SIZE= 36177 ; this.RENDERBUFFER_HEIGHT= 36163 ; this.RENDERBUFFER_INTERNAL_FORMAT= 36164 ; this.RENDERBUFFER_RED_SIZE= 36176 ; this.RENDERBUFFER_STENCIL_SIZE= 36181 ; this.RENDERBUFFER_WIDTH= 36162 ; this.RENDERER= 7937 ; this.REPEAT= 10497 ; this.REPLACE= 7681 ; this.RGB= 6407 ; this.RGB5_A1= 32855 ; this.RGB565= 36194 ; this.RGBA= 6408 ; this.RGBA4= 32854 ; this.SAMPLER_2D= 35678 ; this.SAMPLER_CUBE= 35680 ; this.SAMPLES= 32937 ; this.SAMPLE_ALPHA_TO_COVERAGE= 32926 ; this.SAMPLE_BUFFERS= 32936 ; this.SAMPLE_COVERAGE= 32928 ; this.SAMPLE_COVERAGE_INVERT= 32939 ; this.SAMPLE_COVERAGE_VALUE= 32938 ; this.SCISSOR_BOX= 3088 ; this.SCISSOR_TEST= 3089 ; this.SHADER_TYPE= 35663 ; this.SHADING_LANGUAGE_VERSION= 35724 ; this.SHORT= 5122 ; this.SRC_ALPHA= 770 ; this.SRC_ALPHA_SATURATE= 776 ; this.SRC_COLOR= 768 ; this.STATIC_DRAW= 35044 ; this.STENCIL_ATTACHMENT= 36128 ; this.STENCIL_BACK_FAIL= 34817 ; this.STENCIL_BACK_FUNC= 34816 ; this.STENCIL_BACK_PASS_DEPTH_FAIL= 34818 ; this.STENCIL_BACK_PASS_DEPTH_PASS= 34819 ; this.STENCIL_BACK_REF= 36003 ; this.STENCIL_BACK_VALUE_MASK= 36004 ; this.STENCIL_BACK_WRITEMASK= 36005 ; this.STENCIL_BITS= 3415 ; this.STENCIL_BUFFER_BIT= 1024 ; this.STENCIL_CLEAR_VALUE= 2961 ; this.STENCIL_FAIL= 2964 ; this.STENCIL_FUNC= 2962 ; this.STENCIL_INDEX= 6401 ; this.STENCIL_INDEX8= 36168 ; this.STENCIL_PASS_DEPTH_FAIL= 2965 ; this.STENCIL_PASS_DEPTH_PASS= 2966 ; this.STENCIL_REF= 2967 ; this.STENCIL_TEST= 2960 ; this.STENCIL_VALUE_MASK= 2963 ; this.STENCIL_WRITEMASK= 2968 ; this.STREAM_DRAW= 35040 ; this.SUBPIXEL_BITS= 3408 ; this.TEXTURE= 5890 ; this.TEXTURE0= 33984 ; this.TEXTURE1= 33985 ; this.TEXTURE2= 33986 ; this.TEXTURE3= 33987 ; this.TEXTURE4= 33988 ; this.TEXTURE5= 33989 ; this.TEXTURE6= 33990 ; this.TEXTURE7= 33991 ; this.TEXTURE8= 33992 ; this.TEXTURE9= 33993 ; this.TEXTURE10= 33994 ; this.TEXTURE11= 33995 ; this.TEXTURE12= 33996 ; this.TEXTURE13= 33997 ; this.TEXTURE14= 33998 ; this.TEXTURE15= 33999 ; this.TEXTURE16= 34000 ; this.TEXTURE17= 34001 ; this.TEXTURE18= 34002 ; this.TEXTURE19= 34003 ; this.TEXTURE20= 34004 ; this.TEXTURE21= 34005 ; this.TEXTURE22= 34006 ; this.TEXTURE23= 34007 ; this.TEXTURE24= 34008 ; this.TEXTURE25= 34009 ; this.TEXTURE26= 34010 ; this.TEXTURE27= 34011 ; this.TEXTURE28= 34012 ; this.TEXTURE29= 34013 ; this.TEXTURE30= 34014 ; this.TEXTURE31= 34015 ; this.TEXTURE_2D= 3553 ; this.TEXTURE_BINDING_2D= 32873 ; this.TEXTURE_BINDING_CUBE_MAP= 34068 ; this.TEXTURE_CUBE_MAP= 34067 ; this.TEXTURE_CUBE_MAP_NEGATIVE_X= 34070 ; this.TEXTURE_CUBE_MAP_NEGATIVE_Y= 34072 ; this.TEXTURE_CUBE_MAP_NEGATIVE_Z= 34074 ; this.TEXTURE_CUBE_MAP_POSITIVE_X= 34069 ; this.TEXTURE_CUBE_MAP_POSITIVE_Y= 34071 ; this.TEXTURE_CUBE_MAP_POSITIVE_Z= 34073 ; this.TEXTURE_MAG_FILTER= 10240 ; this.TEXTURE_MIN_FILTER= 10241 ; this.TEXTURE_WRAP_S= 10242 ; this.TEXTURE_WRAP_T= 10243 ; this.TRIANGLES= 4 ; this.TRIANGLE_FAN= 6 ; this.TRIANGLE_STRIP= 5 ; this.UNPACK_ALIGNMENT= 3317 ; this.UNPACK_COLORSPACE_CONVERSION_WEBGL= 37443 ; this.UNPACK_FLIP_Y_WEBGL= 37440 ; this.UNPACK_PREMULTIPLY_ALPHA_WEBGL= 37441 ; this.UNSIGNED_BYTE= 5121 ; this.UNSIGNED_INT= 5125 ; this.UNSIGNED_SHORT= 5123 ; this.UNSIGNED_SHORT_4_4_4_4= 32819 ; this.UNSIGNED_SHORT_5_5_5_1= 32820 ; this.UNSIGNED_SHORT_5_6_5= 33635 ; this.VALIDATE_STATUS= 35715 ; this.VENDOR= 7936 ; this.VERSION= 7938 ; this.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING= 34975 ; this.VERTEX_ATTRIB_ARRAY_ENABLED= 34338 ; this.VERTEX_ATTRIB_ARRAY_NORMALIZED= 34922 ; this.VERTEX_ATTRIB_ARRAY_POINTER= 34373 ; this.VERTEX_ATTRIB_ARRAY_SIZE= 34339 ; this.VERTEX_ATTRIB_ARRAY_STRIDE= 34340 ; this.VERTEX_ATTRIB_ARRAY_TYPE= 34341 ; this.VERTEX_SHADER= 35633 ; this.VIEWPORT= 2978 ; this.ZERO = 0 ;

    var SIZE_OF_VERTEX    = Vec3.SIZE,
        SIZE_OF_COLOR     = Color.SIZE,
        SIZE_OF_TEX_COORD = Vec2.SIZE;

    this.SIZE_OF_VERTEX    = SIZE_OF_VERTEX;
    this.SIZE_OF_NORMAL    = SIZE_OF_VERTEX;
    this.SIZE_OF_COLOR     = SIZE_OF_COLOR;
    this.SIZE_OF_TEX_COORD = SIZE_OF_TEX_COORD;
    this.SIZE_OF_FACE      = SIZE_OF_VERTEX;

    var SIZE_OF_QUAD     = this.SIZE_OF_QUAD     = SIZE_OF_VERTEX * 4,
        SIZE_OF_TRIANGLE = this.SIZE_OF_TRIANGLE = SIZE_OF_VERTEX * 3,
        SIZE_OF_LINE     = this.SIZE_OF_LINE     = SIZE_OF_VERTEX * 2,
        SIZE_OF_POINT    = this.SIZE_OF_POINT    = SIZE_OF_VERTEX;

    this.ELLIPSE_DETAIL_MAX = 30;
    this.ELLIPSE_DETAIL_MIN = 3;


    /*---------------------------------------------------------------------------------------------------------*/
    // Init shared buffers
    /*---------------------------------------------------------------------------------------------------------*/

    this._defaultVBO = gl.createBuffer();
    this._defaultIBO = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,         this._defaultVBO);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._defaultIBO);


    /*---------------------------------------------------------------------------------------------------------*/
    // FrameBuffer RenderBuffer
    /*---------------------------------------------------------------------------------------------------------*/

    /*---------------------------------------------------------------------------------------------------------*/
    // Init flags and caches
    /*---------------------------------------------------------------------------------------------------------*/

    this._bUseLighting         = false;
    this._bUseMaterial         = false;
    this._bUseTexture          = false;

    this._bUseBillboard     = false;

    this._bUseDrawArrayBatch            = false;
    this._bDrawArrayBatchIsDirty        = true;

    //static

    this._bUseDrawElementArrayBatch     = false;
    this._bDrawElementArrayBatchIsDirty = true;

    this._bBatchVertices  = [];
    this._bBatchNormals   = [];
    this._bBatchColors    = [];
    this._bBatchTexCoords = [];
    this._bBatchIndices   = [];

    this._batchVerticesF32Last  = null;
    this._batchNormalsF32Last   = null;
    this._batchColorsF32Last    = null;
    this._batchTexCoordsF32Last = null;
    this._batchIndicesULast     = null;

    //dynamic

    this._bUseDrawElementDynArrayBatch     = false;
    this._bDrawElementDynArrayBatchIsDirty = true;

    this._bBatchDynVerticesF32  = null;
    this._bBatchDynNormalsF32   = null;
    this._bBatchDynColorsF32    = null;
    this._bBatchDynTexCoordsF32 = null;
    this._bBatchDynIndicesU     = null;

    this._bBatchDynVerticesNum  = 0;
    this._bBatchDynNormalsNum   = 0;
    this._bBatchDynColorsNum    = 0;
    this._bBatchDynTexCoordsNum = 0;
    this._bBatchDynIndicesNum   = 0;

    this._bBatchDynamicSizeLast     = -1;

    //

    this._drawFuncLast = null;

    this.RECT_MODE_CORNER = 0;
    this.RECT_MODE_CENTER = 1;

    this._rectMode = 0;
    this._rectModeLast = -1;

    this._rectWidthLast    = -1;
    this._rectHeightLast   = -1;
    this._rectBBWidthLast  = -1;
    this._rectBBHeightLast = -1;


    /*---------------------------------------------------------------------------------------------------------*/
    // Texture
    /*---------------------------------------------------------------------------------------------------------*/

    this._textureMode  = this.REPEAT;
    this._textureSet   = false;

   //this._texEmpty = gl.createTexture();
    //gl.bindTexture(gl.TEXTURE_2D,this._texEmpty);
    //gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1,1,1,1]));
    //gl.uniform1f(program.uUseTexture,0.0);

    this._ctexture = null;


    /*---------------------------------------------------------------------------------------------------------*/
    // Init Matrices
    /*---------------------------------------------------------------------------------------------------------*/

    this._camera     = null;
    this._mModelView = Mat44.make();
    this._mNormal    = Mat33.make();
    this._mStack     = [];

    this._useImageViewport = false;

    /*---------------------------------------------------------------------------------------------------------*/
    // Init Buffers
    /*---------------------------------------------------------------------------------------------------------*/


    this._bScreenCoords = [0,0];
    this._bPoint0       = [0,0,0];
    this._bPoint1       = [0,0,0];

    this._bColor4f   = Color.WHITE();
    this._bColorBg4f = Color.BLACK();
    this._bColor     = this._bColor4f;

    this._axisX = Vec3.AXIS_X();
    this._axisY = Vec3.AXIS_Y();
    this._axisZ = Vec3.AXIS_Z();

    //Point

    this._bVertexPoint = new Float32Array(SIZE_OF_POINT);
    this._bColorPoint  = new Float32Array(SIZE_OF_COLOR);

    //Line

    this._bVertexLine  = new Float32Array(SIZE_OF_LINE);
    this._bColorLine   = new Float32Array(2 * SIZE_OF_COLOR);

    //Triangle

    this._bVertexTriangle          = new Float32Array(SIZE_OF_TRIANGLE);
    this._bNormalTriangle          = new Float32Array(SIZE_OF_TRIANGLE);
    this._bColorTriangle           = new Float32Array(3 * SIZE_OF_COLOR);
    this._bIndexTriangle           = new Uint16Array([0,1,2]);
    this._bTexCoordTriangleDefault = new Float32Array([0.0,0.0,1.0,0.0,1.0,1.0]);
    this._bTexCoordTriangle        = new Float32Array(this._bTexCoordTriangleDefault.length);

    //Quad

    this._bVertexQuad          = new Float32Array(SIZE_OF_QUAD);
    this._bNormalQuad          = new Float32Array(SIZE_OF_QUAD);
    this._bColorQuad           = new Float32Array(4 * SIZE_OF_COLOR);
    this._bIndexQuad           = new Uint16Array([0,1,2,1,2,3]);
   // this._bTexCoordQuadDefault = new Float32Array([0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0]);
    this._bTexCoordQuadDefault = new Float32Array([0.0,1.0,
                                                   1.0,1.0,
                                                   1.0,0.0,
                                                   0.0,0.0]);
    this._bTexCoordQuad        = new Float32Array(this._bTexCoordQuadDefault.length);

    //Rect

    this._bVertexRectCenter = new Float32Array([-0.5,0,-0.5,0.5,0,-0.5,0.5,0,0.5,-0.5,0,0.5]);
    this._bVertexRectCorner = new Float32Array([0,0,0,1,0,0,1,0,1,0,0,1]);
    this._bVertexRectScaled  = new Float32Array(SIZE_OF_QUAD);
    this._bNormalRect = new Float32Array([0,1,0,0,1,0,0,1,0,0,1,0]);
    this._bColorRect  = new Float32Array(4 * SIZE_OF_COLOR);

    //Ellipse

    var ELLIPSE_DETAIL_MAX = this.ELLIPSE_DETAIL_MAX;

    this._bVertexEllipse   = new Float32Array(SIZE_OF_VERTEX * ELLIPSE_DETAIL_MAX);
    this._bNormalEllipse   = new Float32Array(this._bVertexEllipse.length);
    this._bColorEllipse    = new Float32Array(SIZE_OF_COLOR  * ELLIPSE_DETAIL_MAX);
    this._bTexCoordEllipse = new Float32Array(SIZE_OF_TEX_COORD * ELLIPSE_DETAIL_MAX);

    //Cirlce

    this._bVertexCircle   = new Float32Array(this._bVertexEllipse);
    this._bNormalCircle   = new Float32Array(this._bNormalEllipse);
    this._bColorCircle    = new Float32Array(this._bColorEllipse);
    this._bTexCoordCircle = new Float32Array(this._bTexCoordEllipse);

    //Cube

    this._bVertexCube       = new Float32Array([-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5,-0.5,-0.5, -0.5, 0.5,-0.5, 0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,-0.5, 0.5,-0.5,-0.5, 0.5,0.5,-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5,-0.5,-0.5,-0.5,-0.5,-0.5, 0.5,-0.5, 0.5, 0.5,-0.5, 0.5,-0.5]);
    this._bVertexCubeScaled = new Float32Array(new Array(this._bVertexCube.length));
    this._bColorCube        = new Float32Array(this._bVertexCube.length / SIZE_OF_VERTEX * SIZE_OF_COLOR);
    this._bNormalCube       = new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] );
    this._bIndexCube        = new Uint16Array([  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9,10, 8,10,11, 12,13,14,12,14,15, 16,17,18,16,18,19, 20,21,22,20,22,23]);
    this._bTexCoordCube     = new Float32Array(this._bVertexCube.length/3*2);//TODO: add
    //Box

    this._bVertexBox       = new Float32Array(this._bVertexCube);
    this._bVertexBoxScaled = new Float32Array(this._bVertexCubeScaled);
    this._bColorBox        = new Float32Array(this._bColorCube);
    this._bNormalBox       = new Float32Array(this._bNormalCube);
    this._bIndexBox        = new Uint16Array( this._bIndexCube);
    this._bTexCoordBox     = new Float32Array(this._bTexCoordCube);

    this._boxWidthLast  = -1;
    this._boxHeightLast = -1;
    this._boxDepthLast  = -1;

    //Sphere

    this._bVertexSphere       = null;
    this._bVertexSphereScaled = null;
    this._bNormalSphere       = null;
    this._bColorSphere        = null;
    this._bIndexSphere        = null;
    this._bTexCoordsSphere    = null;

    //urgh need to rethink this, sufficient for now
    this._bPositionBBRect     = new Float32Array([0,0,0,0,0,0,0,0,0,0,0,0]);
    this._bVertexBBRectScaled = new Float32Array(8);
    this._bVertexBBRectCenter = new Float32Array([-0.5,-0.5,0.5,-0.5,0.5,0.5,-0.5,0.5]);
    this._bVertexBBrectCorner = new Float32Array([0,0,1,0,1,1,0,1]);
    this._bColorBBRect        = Color.makeColorArrayf(1,1,1,1,16);
    this._bScaleBBRect        = new Float32Array([1,1,1,1,1,1,1,1]);
    this._bTexCoordBBRect     = new Float32Array([0,0,0,1,1,1,0,1]);

    /*
    this._bPositionsBBRect = new Float32Array(this._bPositionBBRect);
    this._bVerticesBBRect  = new Float32Array(this._bVertexBBRectScaled);
    this._bColorsBBRect    = new Float32Array(this._bColorBBRect);
    this._bScalesBBRect    = new Float32Array(this._bScaleBBRect);
    this._bTexCoordsBBRect = new Float32Array(this._bTexCoordBBRect);
    */

    //cache

    this._circleDetailLast = -1;
    this._sphereDetailLast = -1;
    this._sphereScaleLast  = -1;
    this._cubeScaleLast    = -1;
    this._BBRectNumLast    = -1;

    // gen gem

    this.sphereDetail(10);
    this.circleDetail(10);


    /*---------------------------------------------------------------------------------------------------------*/
    // Init
    /*---------------------------------------------------------------------------------------------------------*/

    this.rectMode(this.RECT_MODE_CORNER);
    this.drawMode(this.LINES);
    this.materialMode(this.MATERIAL_MODE_PHONG);

    this.useMaterial(false);
    this.useLighting(false);
    this.pointSize(1.0);

    gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    this.ambient(Color.BLACK());

}

FGL.prototype.useImageViewport = function(bool)
{
    if(bool == this._useImageViewport)return;
    this._useImageViewport = bool;

    if(bool)
    {
        this.useProgram(this._programRenderImage);
        this.gl.uniform2fv(this._cprogram.uWindowSize ,Shared.__windowSize);
    }
    else this.useProgram(this._cprogramLast);

};

/*---------------------------------------------------------------------------------------------------------*/
// Light
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.useLighting  = function(bool)
{
    this._bUseLighting = bool;

    var puUseLighting = this._cprogram.uUseLighting;
    if(puUseLighting !== undefined)this.gl.uniform1f(puUseLighting,Number(bool));
};

FGL.prototype.getLighting  = function(){return this._bUseLighting;};

FGL.prototype.light = function(light)
{
    var id     = light.getId();
    var uLight = this._uLights[id];

        Vec4.set(uLight[0],light.position);
        Vec3.set(uLight[1],light.ambient);
        Vec3.set(uLight[2],light.diffuse);
        Vec4.set(uLight[3],light.specular);

        uLight[4] = light.constantAttentuation;
        uLight[5] = light.linearAttentuation;
        uLight[6] = light.quadricAttentuation;

    if(this._cprogram['uLights['+(this.MAX_LIGHTS - 1)+'].position'] === undefined)
        return;

    this._setLightUniform(id);
};

FGL.prototype._setLightUniform = function(id)
{
    var program = this._cprogram,
        lightId = 'uLights[' + id + '].';

    var uLight  = this._uLights[id];

    var vTemp = Vec4.set(this._vTemp0,uLight[0]);
    var lightPosEyeSpace = Mat44.multVec4(this._mModelView,vTemp);

    var gl = this.gl;

    gl.uniform4fv(program[lightId + 'position'], lightPosEyeSpace);
    gl.uniform3fv(program[lightId + 'ambient'],  uLight[1]);
    gl.uniform3fv(program[lightId + 'diffuse'],  uLight[2]);
    gl.uniform3fv(program[lightId + 'specular'], uLight[3]);

    gl.uniform1f(program[lightId + 'constantAttenuation'],  uLight[4]);
    gl.uniform1f(program[lightId + 'linearAttenuation'],    uLight[5]);
    gl.uniform1f(program[lightId + 'quadraticAttenuation'], uLight[6]);
};

FGL.prototype._setLightUniforms = function()
{
    var program = this._cprogram,
        uLights = this._uLights;

    var i = -1, l = uLights.length;
    var gl = this.gl;

    var uLight, light;


    while(++i < l)
    {
        uLight = uLights[i];
        light  = 'uLights['+i+'].';

        gl.uniform4fv(program[light + 'position'], uLight[0]);
        gl.uniform3fv(program[light + 'ambient'],  uLight[1]);
        gl.uniform3fv(program[light + 'diffuse'],  uLight[2]);
        gl.uniform3fv(program[light + 'specular'], uLight[3]);

        gl.uniform1f(program[light + 'constantAttenuation'], uLight[4]);
        gl.uniform1f(program[light + 'linearAttenuation'],   uLight[5]);
        gl.uniform1f(program[light + 'quadraticAttenuation'],uLight[6]);

    }

};

//FIX ME
FGL.prototype.disableLight = function(light)
{
    var id = light.getId();
    var uLight = this._uLights[id];

    var vZerof = this._vZero3f;

        Vec3.set(uLight[1], vZerof);
        Vec3.set(uLight[2], vZerof);
        Vec3.set(uLight[3], vZerof);

        uLight[4] = 1.0;
        uLight[5] = 0.0;
        uLight[6] = 0.0;

    if(this._cprogram['uLights['+(this.MAX_LIGHTS - 1)+'].position'] === undefined)
        return;

    this._setLightUniform(id);
};



/*---------------------------------------------------------------------------------------------------------*/
// Texture
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.useTexture  = function(bool)
{
    this._bUseTexture = bool;
    var puUseTexture = this._cprogram.uUseTexture;
    if(puUseTexture !== undefined)this.gl.uniform1f(puUseTexture,Number(bool));
};

//TODO: do it the plask way

/*
FGL.prototype._bindTextureImage = function(glTex)
{
    if(!glTex.image)throw ('Texture image is null.');

    var width  = glTex.image.width,
        height = glTex.image.height;

    if((width&(width-1)!=0))       {throw 'Texture image width is not power of 2.'; }
    else if((height&(height-1))!=0){throw 'Texture image height is not power of 2.';}

    var gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D,glTex);
    System.bindTextureImageData(gl,glTex.image,)
   // System.bindTextureImageData(gl,);
   // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glTex.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D,null);


    return glTex;
};
*/

FGL.prototype.bindTextureImage = function(texture)
{
    var gl = this.gl;
    var glTexture;

    if(!texture._texture)texture._texture = gl.createTexture();
    glTexture = texture._texture;


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D,glTexture);
    System.bindTextureImageData(gl,texture._data);
    if(texture._mipmap)gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture._min_filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture._mag_filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texture._wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texture._wrap);
    gl.bindTexture(gl.TEXTURE_2D,null);

    return texture;
};

FGL.prototype.texture = function(texture)
{
    var puTexImage = this._cprogram.uTexImage;
    if(puTexImage === undefined)return;

    if((texture instanceof CanvasTexture) && texture.isDirty())
    {

    }

    var gl = this.gl;
    this._ctexture = texture._texture;
    gl.bindTexture(gl.TEXTURE_2D,this._ctexture);
    gl.uniform1i(puTexImage,0);
};


FGL.prototype.deleteTexture = function(texture)
{}

FGL.prototype.image = function(texture,x,y,width,height)
{
    var puTexImage = this._cprogram.uTexImage;
    if(puTexImage === undefined)return;

    x = x || 0;
    y = y || 0;
    width  = width  === undefined ? texture.getWidth()  : width;
    height = height === undefined ? texture.getHeight() : height;

    if(this._rectMode != this.RECT_MODE_CORNER)
    {
        x -= width  * 0.5;
        y -= height * 0.5;
    }

    var xw = x + width,
        yh = y + height;

    var useTexture = this._bUseTexture;

    if(!useTexture)this.useTexture(true);
    this.texture(texture);

    this.quadf(x,  0, y,
               xw, 0, y,
               xw, 0, yh,
               x,  0, yh);

    if(!useTexture)this.useTexture(false);
};



/*---------------------------------------------------------------------------------------------------------*/
// Material
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.useMaterial = function(bool)
{
    this._bUseMaterial = bool;

    var puUseMaterial= this._cprogram.uUseMaterial;
    if(puUseMaterial !== undefined)this.gl.uniform1f(puUseMaterial,Number(bool));
};

FGL.prototype.materialMode = function(mode)
{
    if(this._materialModeLast == mode)return;

    switch(mode)
    {
        case this.MATERIAL_MODE_COLOR:
            this.useProgram(this._programMaterialColor);
            break;

        case this.MATERIAL_MODE_COLOR_SOLID:
            this.useProgram(this._programMaterialColorSolid);
            break;

        case this.MATERIAL_MODE_NORMAL:
            this.useProgram(this._programMaterialNormal);
            break;

        case this.MATERIAL_MODE_PHONG:
            this.useProgram(this._programDefault);
            this._setMaterialUniforms();
            this._setLightUniforms();
            break;
    }

    var program       = this._cprogram;
    var puPointSize   = program.uPointSize,
        puUseTexture  = program.uUseTexture,
        puUseMaterial = program.uUseMaterial,
        puUseLighting = program.uUseLighting,
        puAmbient     = program.uAmbient;

    var gl = this.gl;

    if(puPointSize   !== undefined)gl.uniform1f(puPointSize,   this._uPointSize);
    if(puUseTexture  !== undefined)gl.uniform1f(puUseTexture,  Number(this._bUseTexture));
    if(puUseMaterial !== undefined)gl.uniform1f(puUseMaterial, Number(this._bUseMaterial));
    if(puUseLighting !== undefined)gl.uniform1f(puUseLighting, Number(this._bUseLighting));
    if(puAmbient     !== undefined)gl.uniform1f(puAmbient,     this._uAmbient);

    this.bindDefaultVBO();
    this.bindDefaultIBO();

    this._materialMode = mode;
};

FGL.prototype.material = function(material)
{
    //Vec4.set(this._uMaterialEmmision,material.emission);
    Vec4.set(this._uMaterialAmbient, material.ambient);
    Vec4.set(this._uMaterialDiffuse, material.diffuse);
    Vec4.set(this._uMaterialSpecular,material.specular);
    this._uMaterialShniness = material.shininess;

    this._setMaterialUniforms();
};

FGL.prototype._setMaterialUniforms = function()
{
    var gl      = this.gl,
        program = this._cprogram;

    var puMaterialAmbient   = program['uMaterial.ambient'],
        puMaterialDiffuse   = program['uMaterial.diffuse'],
        puMaterialSpecular  = program['uMaterial.specular'],
        puMaterialShininess = program['uMaterial.shininess'];

    if(puMaterialAmbient   !== undefined)gl.uniform4fv(puMaterialAmbient,   this._uMaterialAmbient);
    if(puMaterialDiffuse   !== undefined)gl.uniform4fv(puMaterialDiffuse,   this._uMaterialDiffuse);
    if(puMaterialSpecular  !== undefined)gl.uniform4fv(puMaterialSpecular,  this._uMaterialSpecular);
    if(puMaterialShininess !== undefined)gl.uniform1f( puMaterialShininess, this._uMaterialShniness);;
};

/*---------------------------------------------------------------------------------------------------------*/
// Camera
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.setCamera = function(camera){this._camera = camera;};

/*---------------------------------------------------------------------------------------------------------*/
// Matrix stack
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.loadIdentity = function(){this._mModelView = Mat44.identity(this._camera.modelViewMatrix);};
FGL.prototype.pushMatrix   = function(){this._mStack.push(Mat44.copy(this._mModelView));};
FGL.prototype.popMatrix    = function()
{
    var stack = this._mStack;

    if(stack.length == 0)throw new Error(fError.MATRIX_STACK_POP_ERROR);
    this._mModelView = stack.pop();

    return this._mModelView;
};

FGL.prototype.setMatricesUniform = function()
{
    var gl         = this.gl,
        program    = this._cprogram;

    var puModelViewMatrix  = program.uModelViewMatrix,
        puProjectionMatrix = program.uProjectionMatrix;

    var mModelView = this._mModelView;

    if(puModelViewMatrix  !== undefined)gl.uniformMatrix4fv(puModelViewMatrix,  false, mModelView);
    if(puProjectionMatrix !== undefined)gl.uniformMatrix4fv(puProjectionMatrix, false, this._camera.projectionMatrix);

    var puNormalMatrix = program.uNormalMatrix;

    if(!this._bUseLighting ||
        puNormalMatrix === undefined)
        return;

    var mNormal = this._mNormal;

    Mat44.toMat33Inversed(mModelView,mNormal);
    Mat33.transpose(mNormal, mNormal);

    gl.uniformMatrix3fv(puNormalMatrix,false,mNormal);
};

/*---------------------------------------------------------------------------------------------------------*/
// Matrix stack transformations
/*---------------------------------------------------------------------------------------------------------*/

//TODO: fix set/ref
FGL.prototype.translate     = function(v)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(v[0],v[1],v[2],Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.translate3f   = function(x,y,z)      {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(x,y,z,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.translateX    = function(x)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(x,0,0,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.translateY    = function(y)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(0,y,0,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.translateZ    = function(z)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeTranslate(0,0,z,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.scale         = function(v)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(v[0],v[1],v[2],Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));;};
FGL.prototype.scale1f       = function(n)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(n,n,n,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.scale3f       = function(x,y,z)      {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(x,y,z,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.scaleX        = function(x)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(x,1,1,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.scaleY        = function(y)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(1,y,1,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.scaleZ        = function(z)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeScale(1,1,z,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.rotate        = function(v)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationXYZ(v[0],v[1],v[2],Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.rotate3f      = function(x,y,z)      {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationXYZ(x,y,z,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.rotateX       = function(x)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationX(x,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.rotateY       = function(y)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationY(y,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.rotateZ       = function(z)          {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationZ(z,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.rotateAxis    = function(angle,v)    {this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationOnAxis(angle,v[0],v[1],v[2],Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};
FGL.prototype.rotateAxis3f  = function(angle,x,y,z){this._mModelView = Mat44.multPost(this._mModelView,Mat44.makeRotationOnAxis(angle,x,y,z,Mat44.identity(this._mTemp0),Mat44.identity(this._mTemp1)));};

/*---------------------------------------------------------------------------------------------------------*/
// convenience draw
/*---------------------------------------------------------------------------------------------------------*/


FGL.prototype.drawElements = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,indexArray,mode,count,offset,type,drawType)
{
    if(this._bUseDrawElementArrayBatch)
    {
        this._pushElementArrayBatch(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,indexArray);
        return;
    }
    else if(this._bUseDrawElementDynArrayBatch)
    {
        this._pushElementArrayBatchDyn(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,indexArray);
        return;
    }

    var gl = this.gl;

    this.bufferArrays(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this.setMatricesUniform();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexArray,drawType || gl.DYNAMIC_DRAW);
    gl.drawElements((mode === undefined) ? this.TRIANGLES : mode,
                    count || indexArray.length,
                    type  || (Flags.__uintTypeAvailable  ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT),
                    offset || 0);
};


FGL.prototype.drawArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array,mode,first,count)
{
    this.bufferArrays(vertexFloat32Array,normalFloat32Array,colorFloat32Array,uvFloat32Array);
    this.setMatricesUniform();
    this.gl.drawArrays(mode  || this._drawMode,
                       first || 0,
                       count || vertexFloat32Array.length / this.SIZE_OF_VERTEX);
};

FGL.prototype.drawGeometry = function(geom,count,offset) {geom._draw(this,count,offset);};

/*---------------------------------------------------------------------------------------------------------*/
// convenience filling default vbo
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.bufferArrays = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,texCoordFloat32Array,glDrawMode)
{
    var na = normalFloat32Array   ? true : false,
        ca = colorFloat32Array    ? true : false,
        ta = texCoordFloat32Array ? true : false;

    var program = this._cprogram;

    var paVertexPosition = program.aVertexPosition,
        paVertexNormal   = program.aVertexNormal,
        paVertexColor    = program.aVertexColor,
        paVertexTexCoord = program.aVertexTexCoord;

    var gl            = this.gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    glDrawMode = glDrawMode || gl.STATIC_DRAW;

    var vblen =      vertexFloat32Array.byteLength,
        nblen = na ? normalFloat32Array.byteLength   : 0,
        cblen = ca ? colorFloat32Array.byteLength    : 0,
        tblen = ta ? texCoordFloat32Array.byteLength : 0;

    var offsetV = 0,
        offsetN = offsetV + vblen,
        offsetC = offsetN + nblen,
        offsetT = offsetC + cblen;

    gl.bufferData(glArrayBuffer, vblen + nblen + cblen + tblen, glDrawMode);

    gl.bufferSubData(glArrayBuffer, offsetV, vertexFloat32Array);
    gl.vertexAttribPointer(paVertexPosition, this.SIZE_OF_VERTEX, glFloat, false, 0, offsetV);

    if(paVertexNormal !== undefined)
    {
        if(!na){gl.disableVertexAttribArray(paVertexNormal);}
        else
        {
            gl.enableVertexAttribArray(paVertexNormal);
            gl.bufferSubData(glArrayBuffer,offsetN,normalFloat32Array);
            gl.vertexAttribPointer(paVertexNormal,this.SIZE_OF_NORMAL,glFloat,false,0,offsetN);
        }
    }

    if(paVertexColor !== undefined)
    {
        if(!ca){gl.disableVertexAttribArray(paVertexColor);}
        else
        {
            gl.enableVertexAttribArray(paVertexColor);
            gl.bufferSubData(glArrayBuffer, offsetC, colorFloat32Array);
            gl.vertexAttribPointer(paVertexColor, this.SIZE_OF_COLOR,  glFloat, false, 0, offsetC);
        }
    }

    if(paVertexTexCoord !== undefined)
    {
        if(!ta){gl.disableVertexAttribArray(paVertexTexCoord);}
        else
        {
            gl.enableVertexAttribArray(paVertexTexCoord);
            gl.bufferSubData(glArrayBuffer,offsetT,texCoordFloat32Array);
            gl.vertexAttribPointer(paVertexTexCoord,this.SIZE_OF_TEX_COORD,glFloat,false,0,offsetT);
        }
    }
};


FGL.prototype.bufferColors = function(color,buffer)
{
    //if(this._bUseMaterial || this._bUseTexture)return null;

    //hm, fix me
    if(this._bUseMaterial || this._bUseTexture)return buffer;

    var i = 0;

    if(color.length == 4)
    {
        while(i < buffer.length)
        {
            buffer[i]  =color[0];
            buffer[i+1]=color[1];
            buffer[i+2]=color[2];
            buffer[i+3]=color[3];
            i+=4;
        }
    }
    else
    {
        if(color.length != buffer.length)
        {
            throw new Error(fError.COLORS_IN_WRONG_SIZE);
        }

        while(i < buffer.length)
        {
            buffer[i]   = color[i];
            buffer[i+1] = color[i+1];
            buffer[i+2] = color[i+2];
            buffer[i+3] = color[i+3];
            i+=4;
        }
    }

    return buffer;
};

FGL.prototype.bufferVertices = function(vertices,buffer)
{
    if(vertices.length != buffer.length)throw (fError.VERTICES_IN_WRONG_SIZE + buffer.length + '.');
    var i = -1;while(++i < buffer.length)buffer[i] = vertices[i];
    return buffer;
};

/*---------------------------------------------------------------------------------------------------------*/
// Helpers
/*---------------------------------------------------------------------------------------------------------*/


FGL.prototype._scaleVertices1f = function(vert0,scale,vert1)
{
    var i = -1, l = vert0.length;while(++i < l)vert1[i] = vert0[i] * scale;return vert1;
};

FGL.prototype._scaleVertices2f = function(vert0,scaleX,scaleY,vert1)
{
    var i = 0, l = vert0.length;
    while(i < l)
    {
        vert1[i  ] = vert0[i  ] * scaleX;
        vert1[i+1] = vert0[i+1] * scaleY;

        i+=2;
    }

    return vert1;
};

FGL.prototype._scaleVertices3f = function(vert0,scaleX,scaleY,scaleZ,vert1)
{
    var i = 0, l = vert0.length;
    while(i < l)
    {
        vert1[i  ] = vert0[i  ] * scaleX;
        vert1[i+1] = vert0[i+1] * scaleY;
        vert1[i+2] = vert0[i+2] * scaleZ;

        i+=3;
    }

    return vert1;
};


/*---------------------------------------------------------------------------------------------------------*/
// Batch
/*---------------------------------------------------------------------------------------------------------*/


FGL.prototype.beginDrawArrayBatch = function(){};
FGL.prototype.endDrawArrayBatch = function(){};
FGL.prototype.drawArrayBatch = function(){};

//dynamic

FGL.prototype.beginDynamicDrawElementArrayBatch = function(size)
{
    if(size != this._bBatchDynamicSizeLast)
    {
        var n = size / this.SIZE_OF_VERTEX;

        //TODO: check size
        this._bBatchDynVerticesF32  = new Float32Array(size);
        this._bBatchDynNormalsF32   = new Float32Array(size * 10);
        this._bBatchDynColorsF32    = new Float32Array(n * this.SIZE_OF_COLOR);
        this._bBatchDynTexCoordsF32 = new Float32Array(n * this.SIZE_OF_TEX_COORD);

        this._bBatchDynIndicesU     = Flags.__uintTypeAvailable ? new Uint32Array(size * 3) :
                                                                      new Uint16Array(size * 3);
    }

    this._bBatchDynVerticesNum  = 0;
    this._bBatchDynNormalsNum   = 0;
    this._bBatchDynColorsNum    = 0;
    this._bBatchDynTexCoordsNum = 0;
    this._bBatchDynIndicesNum   = 0;

    this._bUseDrawElementDynArrayBatch     = true;
    this._bDrawElementDynArrayBatchIsDirty = true;

    this._bBatchDynamicSizeLast = size;
};

FGL.prototype.endDynamicDrawElementArrayBatch = function(){this._bUseDrawElementDynArrayBatch = false;};

FGL.prototype.getElementArrayDynamicBatch = function()
{
    return [this._bBatchDynVerticesF32,
            this._bBatchDynNormalsF32,
            this._bBatchDynColorsF32,
            this._bBatchDynTexCoordsF32,
            this._bBatchDynIndicesU];
};

FGL.prototype._pushElementArrayBatchDyn = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,texCoordsFloat32Array,indexUint16Array)
{
    var mTemp0 = Mat44.identity(this._mTemp0),
        mTemp1 = Mat44.identity(this._mTemp1),
        mTemp2 = Mat44.identity(this._mTemp2);

    var modelViewMat    = Mat44.set(mTemp0, this._mModelView),
        transMatrix     = Mat44.mult(modelViewMat,Mat44.invert(this._camera.modelViewMatrix,mTemp2),mTemp1);

    var batch,offset,length,index;

        batch  = this._bBatchDynVerticesF32;
        offset = this._bBatchDynVerticesNum;
        length = offset + vertexFloat32Array.length;
        index  = 0;

    while(offset < length)
    {
        batch[offset  ] = vertexFloat32Array[index  ];
        batch[offset+1] = vertexFloat32Array[index+1];
        batch[offset+2] = vertexFloat32Array[index+2];

        Mat44.multVec3AI(transMatrix,batch,offset);

        offset+=3;
        index +=3;
    }

    if(normalFloat32Array)
    {
        batch  = this._bBatchDynNormalsF32;
        offset = this._bBatchDynNormalsNum;
        length = offset + normalFloat32Array.length;
        index  = 0;

        while(offset < length)
        {
            batch[offset  ] = normalFloat32Array[index  ];
            batch[offset+1] = normalFloat32Array[index+1];
            batch[offset+2] = normalFloat32Array[index+2];

            offset+=3;
            index +=3;
        }

        //this._putBatchDyn(this._bBatchDynNormalsF32,  normalFloat32Array,   this._bBatchDynNormalsNum);
    }

    if(colorFloat32Array    )this._putBatchDyn(this._bBatchDynColorsF32,   colorFloat32Array,    this._bBatchDynColorsNum);
    if(texCoordsFloat32Array)this._putBatchDyn(this._bBatchDynTexCoordsF32,texCoordsFloat32Array,this._bBatchDynTexCoordsNum);

    var offsetIndex        = this._bBatchDynVerticesNum / 3;

        batch  = this._bBatchDynIndicesU;
        offset = this._bBatchDynIndicesNum;
        length = offset + indexUint16Array.length;
        index  = 0;

    while(offset < length){batch[offset] = indexUint16Array[index] + offsetIndex;offset++;index++;}

    this._bBatchDynVerticesNum  += vertexFloat32Array.length;
    this._bBatchDynNormalsNum   += normalFloat32Array.length;
    this._bBatchDynColorsNum    += colorFloat32Array.length;
    this._bBatchDynTexCoordsNum += texCoordsFloat32Array.length;
    this._bBatchDynIndicesNum   += indexUint16Array.length;

};


/*
FGL.prototype._pushElementArrayBatchDynamic = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,texCoordsFloat32Array,indexUint16Array)
{
    var mTemp0 = Mat44.identity(this._mTemp0),
        mTemp1 = Mat44.identity(this._mTemp1),
        mTemp2 = Mat44.identity(this._mTemp2);

    var modelViewMat    = Mat44.set(mTemp0, this._mModelView),
        transMatrix     = Mat44.mult(modelViewMat,Mat44.invert(this._camera.modelViewMatrix,mTemp2),mTemp1);

    var offsetIndex = this._bBatchDynVerticesNum / 3;
    var offset,length,index;

    var batchVertices       = this._bBatchDynVerticesF32,
        batchVerticesOffset = this._bBatchDynVerticesNum,
        batchVerticesLength = batchVerticesOffset + vertexFloat32Array.length;

        offset = batchVerticesOffset;
        length = batchVerticesLength;
        index  = 0;

    while(offset < length)
    {
        batchVertices[offset  ] = vertexFloat32Array[index  ];
        batchVertices[offset+1] = vertexFloat32Array[index+1];
        batchVertices[offset+2] = vertexFloat32Array[index+2];

        Mat44.multVec3AI(transMatrix,batchVertices,offset);

        offset+=3;
        index +=3;
    }

    if(normalFloat32Array   )this._putBatchDyn(this._bBatchDynNormalsF32,normalFloat32Array,batchVerticesOffset);
    if(colorFloat32Array    )this._putBatchDyn(this._bBatchDynColorsF32,colorFloat32Array,batchVerticesOffset / 3 * 4);
    if(texCoordsFloat32Array)this._putBatchDyn(this._bBatchDynTexCoordsF32,texCoordsFloat32Array,batchVerticesOffset / 3 * 2);

    var batchIndices       = this._bBatchDynIndicesU,
        batchIndicesOffset = this._bBatchDynIndicesNum,
        batchIndicesLength = batchIndicesOffset + indexUint16Array.length;

        offset = batchIndicesOffset;
        length = batchIndicesLength;
        index  = 0;

    while(offset < length){batchIndices[offset] = indexUint16Array[index] + offsetIndex;offset++;index++;}

    this._bBatchDynIndicesNum  += indexUint16Array.length;
    this._bBatchDynVerticesNum += vertexFloat32Array.length;
};
*/

FGL.prototype.drawElementArrayBatchDynamic = function(batch)
{
    if(this._bUseDrawElementDynArrayBatch)
    {
        if(batch)
        {
            this._pushElementArrayBatchDyn(batch[0],
                batch[1],
                batch[2],
                batch[3],
                batch[4]);

            return;
        }


        /*
        this._pushElementArrayBatchDynamic(this._bBatchVertices,
            this._bBatchNormals,
            this._bBatchColors,
            this._bBatchTexCoords,
            this._bBatchIndices);
        */

        return;
    }
    /*
    if(batch)
    {
        this.drawElements(batch[0],
            batch[1],
            batch[2],
            batch[3],
            batch[4],
            this.getDrawMode());

        return;
    }

    var batchVertices,
        batchNormals,
        batchColors,
        batchTexCoords,
        batchIndices;

    if(this._drawFuncLast == this.drawElementArrayBatch ||
        !this._bDrawElementDynArrayBatchIsDirty)
    {
        batchVertices  = this._batchVerticesF32Last;
        batchNormals   = this._batchNormalsF32Last;
        batchColors    = this._batchColorsF32Last;
        batchTexCoords = this._batchTexCoordsF32Last;
        batchIndices   = this._batchIndicesULast;
    }
    else
    {
        batchVertices  = this._batchVerticesF32Last  = new Float32Array(this._bBatchVertices);
        batchNormals   = this._batchNormalsF32Last   = new Float32Array(this._bBatchNormals);
        batchColors    = this._batchColorsF32Last    = new Float32Array(this._bBatchColors);
        batchTexCoords = this._batchTexCoordsF32Last = new Float32Array(this._bBatchTexCoords);
        batchIndices   = this._batchIndicesULast   = Flags.__uintTypeAvailable  ? new Uint32Array(this._bBatchIndices) :
            new Uint16Array(this._bBatchIndices);
    }
    */

    //console.log(this._bBatchDynIndicesNum);


    this.drawElements(this._bBatchDynVerticesF32,
                      this._bBatchDynNormalsF32,
                      this._materialMode != this.MATERIAL_MODE_COLOR_SOLID ?
                        this._bBatchDynColorsF32 :
                        null,
                      this._bBatchDynTexCoordsF32,
                      this._bBatchDynIndicesU,
                      this.getDrawMode(),
                      this._bBatchDynIndicesNum,
                      0);


    this._drawFuncLast = this.drawElementArrayBatchDynamic;
    this._bDrawElementDynArrayBatchIsDirty = false;
};

//static

FGL.prototype.beginDrawElementArrayBatch = function()
{
    this._bBatchVertices.length  = 0;
    this._bBatchNormals.length   = 0;
    this._bBatchColors.length    = 0;
    this._bBatchTexCoords.length = 0;
    this._bBatchIndices.length   = 0;

    this._bUseDrawElementArrayBatch     = true;
    this._bDrawElementArrayBatchIsDirty = true;
};

FGL.prototype.endDrawElementArrayBatch = function(){this._bUseDrawElementArrayBatch = false;};

FGL.prototype.getElementArrayBatch = function()
{
    return [this._bBatchVertices,
            this._bBatchNormals,
            this._bBatchColors,
            this._bBatchTexCoords,
            this._bBatchIndices];
};

FGL.prototype._pushElementArrayBatch = function(vertexFloat32Array,normalFloat32Array,colorFloat32Array,texCoordsFloat32Array,indexUint16Array)
{
    var mTemp0 = Mat44.identity(this._mTemp0),
        mTemp1 = Mat44.identity(this._mTemp1),
        mTemp2 = Mat44.identity(this._mTemp2);

    var modelViewMat    = Mat44.set(mTemp0, this._mModelView),
        transMatrix     = Mat44.mult(modelViewMat,Mat44.invert(this._camera.modelViewMatrix,mTemp2),mTemp1);

    var offsetIndex = this._bBatchVertices.length / 3;
    var offset,length,index;

    var batchVertices        = this._bBatchVertices,
        batchVerticesOffset  = batchVertices.length;
        batchVertices.length+= vertexFloat32Array.length;

        offset = batchVerticesOffset;
        length = batchVertices.length;
        index  = 0;

    while(offset < length)
    {
        batchVertices[offset  ] = vertexFloat32Array[index  ];
        batchVertices[offset+1] = vertexFloat32Array[index+1];
        batchVertices[offset+2] = vertexFloat32Array[index+2];

        Mat44.multVec3AI(transMatrix,batchVertices,offset);

        offset+=3;
        index +=3;
    }

    if(normalFloat32Array   )this._putBatch(this._bBatchNormals,normalFloat32Array);
    if(colorFloat32Array    )this._putBatch(this._bBatchColors,colorFloat32Array);
    if(texCoordsFloat32Array)this._putBatch(this._bBatchTexCoords,texCoordsFloat32Array);

    var batchIndices        = this._bBatchIndices,
        batchIndicesOffset  = batchIndices.length;
        batchIndices.length+= indexUint16Array.length;

        offset = batchIndicesOffset;
        length = batchIndices.length;
        index  = 0;

    while(offset < length){batchIndices[offset] = indexUint16Array[index] + offsetIndex;offset++;index++;}
};

FGL.prototype.drawElementArrayBatch = function(batch)
{
    if(this._bUseDrawElementArrayBatch)
    {
        if(batch)
        {
            this._pushElementArrayBatch(batch[0],batch[1],batch[2],batch[3],batch[4]);
            return;
        }

        this._pushElementArrayBatch(this._bBatchVertices,this._bBatchNormals,this._bBatchColors,this._bBatchTexCoords,this._bBatchIndices);
        return;
    }

    if(batch)
    {
        this.drawElements(batch[0],batch[1],batch[2],batch[3],batch[4],this.getDrawMode());
        return;
    }

    var batchVertices,
        batchNormals,
        batchColors,
        batchTexCoords,
        batchIndices;

    if(this._drawFuncLast == this.drawElementArrayBatch ||
       !this._bDrawElementArrayBatchIsDirty)
    {
        batchVertices  = this._batchVerticesF32Last;
        batchNormals   = this._batchNormalsF32Last;
        batchColors    = this._batchColorsF32Last;
        batchTexCoords = this._batchTexCoordsF32Last;
        batchIndices   = this._batchIndicesULast;
    }
    else
    {
        batchVertices  = this._batchVerticesF32Last  = new Float32Array(this._bBatchVertices);
        batchNormals   = this._batchNormalsF32Last   = new Float32Array(this._bBatchNormals);
        batchColors    = this._batchColorsF32Last    = new Float32Array(this._bBatchColors);
        batchTexCoords = this._batchTexCoordsF32Last = new Float32Array(this._bBatchTexCoords);
        batchIndices   = this._batchIndicesULast     = Flags.__uintTypeAvailable  ?
                                                        new Uint32Array(this._bBatchIndices) :
                                                        new Uint16Array(this._bBatchIndices);
  }


    this.drawElements(batchVertices,
                      batchNormals,
                      batchColors,
                      batchTexCoords,
                      batchIndices,
                      this.getDrawMode());


    this._drawFuncLast = this.drawElementArrayBatch;
    this._bDrawElementArrayBatchIsDirty = false;
};

FGL.prototype._putBatch = function(batchArray,dataArray)
{
    var batchOffset   = batchArray.length;
    batchArray.length+= dataArray.length;

    var len = batchArray.length;
    var index = 0;

    while(batchOffset < len){batchArray[batchOffset++] = dataArray[index++];}
};

FGL.prototype._putBatchDyn = function(batchArray,dataArray,offset)
{
    var len = offset + dataArray.length,index = 0;
    while(offset < len){batchArray[offset++] = dataArray[index++];}
};





/*---------------------------------------------------------------------------------------------------------*/
// Convenience Methods color
/*---------------------------------------------------------------------------------------------------------*/

// ambient

FGL.prototype.ambient3f = function(r,g,b)
{
    var uAmbient  = this._uAmbient,
        program   = this._cprogram,
        puAmbient = program.uAmbient;

    Vec3.set3f(uAmbient,r,g,b);
    if(puAmbient !== undefined)this.gl.uniform3fv(puAmbient,uAmbient);
};

FGL.prototype.ambient   = function(color){this.ambient3f(color[0],color[1],color[2]);};
FGL.prototype.ambient1f = function(k)    {this.ambient3f(k,k,k);};


// color

FGL.prototype.color4f = function(r,g,b,a)
{
    var program       = this._cprogram,
        puVertexColor = program.uVertexColor;

    this._bColor = Color.set4f(this._bColor4f,r,g,b,a);
    if(puVertexColor !== undefined)this.gl.uniform4fv(puVertexColor,this._bColor);
};


FGL.prototype.color   = function(color){this.color4f(color[0],color[1],color[2],color[3]);};
FGL.prototype.color3f = function(r,g,b){this.color4f(r,g,b,1.0);};
FGL.prototype.color2f = function(k,a)  {this.color4f(k,k,k,a);};
FGL.prototype.color1f = function(k)    {this.color4f(k,k,k,1.0);};
FGL.prototype.colorfv = function(array){if(this._cprogram.uVertexColor)return;this._bColor = array;};

// alpha

FGL.prototype.alpha = function(alpha)
{
    var bColor = this._bColor;
    if(bColor.length == 4){bColor[3] = alpha;return;}

    var i = 0, l = bColor.length;
    while(i < l){bColor[i] = alpha;i+=4;}
};

FGL.prototype.clearColor = function(color){this.clear4f(color[0],color[1],color[2],color[3]);};
FGL.prototype.clear      = function()     {this.clear4f(0,0,0,1);};
FGL.prototype.clear3f    = function(r,g,b){this.clear4f(r,g,b,1);};
FGL.prototype.clear2f    = function(k,a)  {this.clear4f(k,k,k,a);};
FGL.prototype.clear1f    = function(k)    {this.clear4f(k,k,k,1.0);};
FGL.prototype.clear4f    = function(r,g,b,a)
{
    var c  = Color.set4f(this._bColorBg4f,r,g,b,a);
    var gl = this.gl;
    gl.clearColor(c[0],c[1],c[2],c[3]);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};


FGL.prototype.getColorBuffer = function(){return this._bColor;};
FGL.prototype.getClearBuffer = function(){return this._bColorBg4f;};

/*---------------------------------------------------------------------------------------------------------*/
// Methods draw properties
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.drawMode = function(mode){this._drawMode = mode;};
FGL.prototype.getDrawMode = function(){return this._drawMode;};

FGL.prototype.sphereDetail = function(detail)
{
    if(detail == this._sphereDetailLast)return;
    this._sphereDetailLast = detail;
    this._genSphere();
};

FGL.prototype.circleDetail = function(detail)
{
    if(detail == this._circleDetailLast )return;
    this._circleDetailLast  = Math.max(this.ELLIPSE_DETAIL_MIN,Math.min(detail,this.ELLIPSE_DETAIL_MAX));
    this._cirlceVertexCount = this._circleDetailLast * 3;
    this._genCircle();
};

FGL.prototype.lineWidth = function(size){this.gl.lineWidth(size);};

FGL.prototype.useBillboard = function(bool)
{
    if(this._bUseBillboard == bool)return;

    if(bool)
    {
        this.useProgram(this._programRenderBillboard);
        this.bindDefaultVBO();
    }
    else
    {
        this.materialMode(this._materialModeLast);
    }

    this._bUseBillboard = bool;

};


FGL.prototype.pointSize    = function(value)
{
    var program     = this._cprogram,
        puPointSize = program.uPointSize;

    //hm
    this._uPointSize = value;
    if(puPointSize !== undefined)this.gl.uniform1f(puPointSize,this._uPointSize);
};

FGL.prototype.rectMode = function(mode)
{
    this._rectModeLast = this._rectMode;
    this._rectMode = mode;
};


/*---------------------------------------------------------------------------------------------------------*/
// Methods draw primitives
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.point = function(vector)
{
    if(vector.length == 0)return;

    var bColorPoint = this._bColorPoint,
        bColor      = this._bColor;

    bColorPoint[0] = bColor[0];
    bColorPoint[1] = bColor[1];
    bColorPoint[2] = bColor[2];
    bColorPoint[3] = bColor[3];

    var gl = this.gl,
        glArrayBuffer = gl.ARRAY_BUFFER,
        glFloat       = gl.FLOAT;

    var vblen = vector.byteLength,
        cblen = bColor.byteLength;

    var offsetV = 0,
        offsetC = vblen;

    var program         = this._cprogram,
        aVertexPosition = program.aVertexPosition,
        aVertexNormal   = program.aVertexNormal,
        aVertexColor    = program.aVertexColor,
        aVertexTexCoord = program.aVertexTexCoord;

    gl.bufferData(glArrayBuffer,vblen + cblen,gl.STATIC_DRAW);

    gl.bufferSubData(glArrayBuffer, offsetV, vector);
    gl.bufferSubData(glArrayBuffer, offsetC, bColor);

    gl.disableVertexAttribArray(aVertexNormal);
    gl.disableVertexAttribArray(aVertexTexCoord);

    gl.vertexAttribPointer(aVertexPosition, this.SIZE_OF_VERTEX, glFloat, false, 0, offsetV);
    gl.vertexAttribPointer(aVertexColor,    this.SIZE_OF_COLOR,  glFloat, false, 0, offsetC);

    this.setMatricesUniform();
    gl.drawArrays(this._drawMode,0,1);

    gl.enableVertexAttribArray(aVertexNormal);
    gl.enableVertexAttribArray(aVertexTexCoord);

    this._drawFuncLast = this.point;
};

FGL.prototype.points = function(vertices,colors,first,count)
{
    if(vertices.length == 0)return;

    var materialMode = this._materialMode;

    this.drawArrays(vertices,
                    null,
                    materialMode != this.MATERIAL_MODE_COLOR_SOLID &&
                    materialMode != this.MATERIAL_MODE_NORMAL  ?
                        colors || this.bufferColors(this._bColor4f,new Float32Array(vertices.length / 3 * 4)) :
                        null,
                    null,
                    this._drawMode,
                    first,
                    count);

    this._drawFuncLast = this.points;
};

FGL.prototype.point3f = function(x,y,z){this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = z;this.point(this._bVertexPoint);};
FGL.prototype.point2f = function(x,y)  {this._bVertexPoint[0] = x;this._bVertexPoint[1] = y;this._bVertexPoint[2] = 0;this.point(this._bVertexPoint);};

/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.linef = function(x0,y0,z0,x1,y1,z1)
{
    var v = this._bVertexLine;
    v[0] = x0;v[1] = y0;v[2] = z0;
    v[3] = x1;v[4] = y1;v[5] = z1;

    var materialMode = this._materialMode;

    this.drawArrays(v,
                    null,
                    materialMode != this.MATERIAL_MODE_COLOR_SOLID &&
                    materialMode != this.MATERIAL_MODE_NORMAL ?
                        this.bufferColors(this._bColor,this._bColorLine) :
                        null,
                    null,
                    this._drawMode);

    this._drawFuncLast = this.linef;
};

FGL.prototype.line  = function(vertices)
{
    if(vertices.length == 0)return;

    var materialMode = this._materialMode;

    this.drawArrays(this.bufferArrays(vertices,this._bVertexLine),
                    null,
                    materialMode != this.MATERIAL_MODE_COLOR_SOLID  &&
                    materialMode != this.MATERIAL_MODE_NORMAL ?
                        this.bufferColors(this._bColor,this._bColorLine) :
                        null,
                    null,
                    this._drawMode,
                    0,
                    2);

    this._drawFuncLast = this.line;
};

FGL.prototype.linev = function(vertices)
{
    if(vertices.length == 0)return;
    var v = new Float32Array(vertices),
        l = vertices.length / this.SIZE_OF_VERTEX;

    var materialMode = this._materialMode;

    this.drawArrays(v,
                    null,
                    materialMode != this.MATERIAL_MODE_COLOR_SOLID  &&
                    materialMode != this.MATERIAL_MODE_NORMAL ?
                        this.bufferColors(this._bColor, new Float32Array(l*this.SIZE_OF_COLOR)) :
                        null,
                    null,
                    this._drawMode,
                    0,
                    l);

    this._drawFuncLast = this.linev;
};

FGL.prototype.line2fv = function(v0,v1){this.linef(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2]);};

/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.quadf = function(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3)
{
    var v = this._bVertexQuad;

    v[ 0] = x0;v[ 1] = y0;v[ 2] = z0;
    v[ 3] = x1;v[ 4] = y1;v[ 5] = z1;
    v[ 6] = x2;v[ 7] = y2;v[ 8] = z2;
    v[ 9] = x3;v[10] = y3;v[11] = z3;

    var materialMode = this._materialMode;

    this.drawArrays(v,
                    null,
                    materialMode != this.MATERIAL_MODE_COLOR_SOLID &&
                    materialMode != this.MATERIAL_MODE_NORMAL ?
                        this.bufferColors(this._bColor,this._bColorQuad) :
                        null,
                    this._bTexCoordQuadDefault,
                    this._drawMode,
                    0,
                    4);

    this._drawFuncLast = this.quadf;
};

FGL.prototype.quadv = function(v0,v1,v2,v3)
{
    this.quadf(v0[0],v0[1],v0[2],v1[0],v1[1],v1[2],v2[0],v2[1],v2[2],v3[0],v3[1],v3[2]);
};

FGL.prototype.quad = function(vertices,normals,texCoords)
{
    var materialMode = this._materialMode;

    this.drawArrays(this.bufferArrays(vertices,this._bVertexQuad),
                    normals,
                    materialMode != this.MATERIAL_MODE_COLOR_SOLID &&
                    materialMode != this.MATERIAL_MODE_NORMAL ?
                        this.bufferColors(this._bColor,this._bColorQuad) :
                        null,
                    texCoords,
                    this._drawMode,
                    0,
                    4);

    this._drawFuncLast = this.quad;
};

/*---------------------------------------------------------------------------------------------------------*/


FGL.prototype.rect = function(width,height)
{
    height = height || width;

    var rectMode = this._rectMode;
    var vertices;

    if(this._bUseBillboard)
    {
        var program = this._cprogram;

        var paPostion        = program.aPosition,
            paVertexPosition = program.aVertexPosition,
            paVertexColor    = program.aVertexColor,
            paVertexScale    = program.aVertexScale,
            paVertexTexCoord = program.aVertexTexCoord;

        var gl            = this.gl,
            glArrayBuffer = gl.ARRAY_BUFFER,
            glFloat       = gl.FLOAT;

        var position   = this._bPositionBBRect;
            vertices   = this._bVertexBBRectScaled;
        var colors     = this.bufferColors(this._bColor,this._bColorBBRect),
            scales     = this._bScaleBBRect,
            texCoords  = this._bTexCoordBBRect;


            if(width != this._rectBBWidthLast ||
               height != this._rectBBHeightLast ||
               rectMode != this._rectModeLast)
            {
                this._scaleVertices2f(rectMode == this.RECT_MODE_CORNER ?
                                      this._bVertexBBrectCorner :
                                      this._bVertexBBRectCenter,
                                      width,height,vertices);

                this._rectBBWidthLast  = width;
                this._rectBBHeightLast = height;
            }

        var plen  = position.byteLength,
            vblen = vertices.byteLength,
            cblen = colors.byteLength,
            sblen = scales.byteLength,
            tblen = texCoords.byteLength;

        var offsetP = 0,
            offsetV = offsetP + plen,
            offsetC = offsetV + vblen,
            offsetT = offsetC + cblen,
            offsetS = offsetT + tblen;


        gl.bufferData(glArrayBuffer,plen + vblen + cblen + tblen + sblen,gl.STATIC_DRAW);

        gl.bufferSubData(glArrayBuffer,offsetP,position);
        gl.bufferSubData(glArrayBuffer,offsetV,vertices);
        gl.bufferSubData(glArrayBuffer,offsetC,colors);
        gl.bufferSubData(glArrayBuffer,offsetT,texCoords);
        gl.bufferSubData(glArrayBuffer,offsetS,scales);

        gl.vertexAttribPointer(paPostion,this.SIZE_OF_VERTEX,glFloat,false,0,offsetP);
        gl.vertexAttribPointer(paVertexPosition,2,glFloat,false,0,offsetV);
        gl.vertexAttribPointer(paVertexColor,   this.SIZE_OF_COLOR,glFloat,false,0,offsetC);
        gl.vertexAttribPointer(paVertexTexCoord, this.SIZE_OF_TEX_COORD,glFloat,false,0,offsetT);

        gl.vertexAttribPointer(paVertexScale, 2, glFloat, false, 0, offsetS);

        this.setMatricesUniform();
        gl.drawArrays(this._drawMode,0,4);

        return;
    }
    else
    {
        vertices = this._bVertexRectScaled;

        if(width != this._rectWidthLast ||
           height != this._rectHeightLast ||
           rectMode != this._rectModeLast)
        {
            this._scaleVertices3f(rectMode == this.RECT_MODE_CORNER ?
                                  this._bVertexRectCorner :
                                  this._bVertexRectCenter,
                                  width,0,height,vertices);

            this._rectWidthLast  = width;
            this._rectHeightLast = height;
        }

        var materialMode = this._materialMode;

        this.drawArrays(vertices,
                        this._bNormalRect,
                        materialMode != this.MATERIAL_MODE_COLOR_SOLID &&
                        materialMode != this.MATERIAL_MODE_NORMAL ?
                            this.bufferColors(this._bColor,this._bColorRect) :
                            null,
                        this._bTexCoordQuadDefault,
                        this._drawMode,
                        0,
                        4);

    }



    this._drawFuncLast = this.rect;
};

FGL.prototype.rectv = function(positionArray,sizeArray,colorArray,texCoordArray)
{
    var posArrLen = positionArray.length;

    if(this._bUseBillboard)
    {
        var SIZE_OF_QUAD = this.SIZE_OF_QUAD;

        if(posArrLen > this._BBRectNumLast)
        {
            var normLen = posArrLen / 3 * 4;
            var i = -1;

            this._bPositionsBBRect = new Float32Array(posArrLen * 4);
            this._bVerticesBBRect  = new Float32Array(normLen * 2);
            this._bColorsBBRect    = new Float32Array(normLen * 4);
            this._bScalesBBRect    = new Float32Array(normLen * 2);
            this._bTexCoordsBBRect = new Float32Array(normLen * 2);




        }
        else if(posArrLen < this._BBRectNumLast)
        {

        }




        this._BBRectNumLast = posArrLen;
    }
    else
    {

    }

};

/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.triangle = function(v0,v1,v2)
{
    var v = this._bVertexTriangle;
    v[0] = v0[0];v[1] = v0[1];v[2] = v0[2];
    v[3] = v1[0];v[4] = v1[1];v[5] = v1[2];
    v[6] = v2[0];v[7] = v2[1];v[8] = v2[2];

    this.drawArrays(v,
                    null,
                    this._materialMode != this.MATERIAL_MODE_COLOR_SOLID ?
                        this.bufferColors(this._bColor,this._bColorTriangle) :
                        null,
                    null,
                    this._drawMode,
                    0,
                    3);

    this._drawFuncLast = this.triangle;
};

FGL.prototype.trianglef = function(v0,v1,v2,v3,v4,v5,v6,v7,v8)
{
    var v = this._bVertexTriangle;
    v[0] = v0;v[1] = v1;v[2] = v2;
    v[3] = v3;v[4] = v4;v[5] = v5;
    v[6] = v6;v[7] = v7;v[8] = v8;

    this.drawArrays(v,
                    null,
                    this._materialMode != this.MATERIAL_MODE_COLOR_SOLID ?
                        this.bufferColors(this._bColor,this._bColorTriangle) :
                        null,
                    null,
                    this._drawMode,0,3);

    this._drawFuncLast = this.trianglef;
};

FGL.prototype.trianglev = function(vertices,normals,texCoords)
{
    this.drawArrays(this.bufferArrays(vertices,this._bVertexTriangle),
                    normals,
                    this._materialMode != this.MATERIAL_MODE_COLOR_SOLID ?
                        this.bufferColors(this._bColor,this._bColorTriangle) :
                        null,
                    texCoords,
                    this._drawMode,
                    0,
                    3);

    this._drawFuncLast = this.trianglev;
};

/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.circle3f = function(x,y,z,radius)
{
    radius = radius || 0.5;

    this.pushMatrix();
    this.translate3f(x,y,z);
    this.scale1f(radius);

    this.drawArrays(this._bVertexCircle,
                    this._bNormalCircle,
                    this._materialMode != this.MATERIAL_MODE_COLOR_SOLID ?
                        this.bufferColors(this._bColor,this._bColorCircle) :
                        null,
                    this._bTexCoordCircle,
                    this.getDrawMode(),
                    0,
                    this._circleDetailLast);

    this.popMatrix();

    this._drawFuncLast = this.linef;
};

FGL.prototype.cirlce2f = function(x,y,radius){this.circle3f(x,0,y,radius);};
FGL.prototype.circle = function(radius){this.circle3f(0,0,0,radius)};
FGL.prototype.circlev = function(v,radius){this.circle3f(v[0],v[1],v[2],radius);};
FGL.prototype.circles = function(centers,radii){};

/*---------------------------------------------------------------------------------------------------------*/
// Geom3d gen
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype._genSphere = function()
{
    var segments = this._sphereDetailLast;

    var vertices  = [],
        normals   = [],
        texCoords = [],
        indices   = [];

    var theta,thetaSin,thetaCos;
    var phi,phiSin,phiCos;

    var x,y,z;
    var u,v;

    var i = -1,j;

    var index,
        indexVertices,
        indexNormals,
        indexTexCoords;

    while(++i <= segments)
    {
        theta = i * Math.PI / segments;
        thetaSin = Math.sin(theta);
        thetaCos = Math.cos(theta);

        j = -1;
        while(++j <= segments)
        {
            phi    = j * 2 * Math.PI / segments;
            phiSin = Math.sin(phi);
            phiCos = Math.cos(phi);

            x = phiCos * thetaSin;
            y = thetaCos;
            z = phiSin * thetaSin;

            index          = j + segments * i;
            indexVertices  = indexNormals = index * 3;
            indexTexCoords = index * 2;

            normals.push(x,y,z);
            vertices.push(x,y,z);

            u = 1 - j / segments;
            v = 1 - i / segments;

            texCoords.push(u,v);

        }


    }

    var index0,index1,index2;

    i = -1;
    while(++i < segments)
    {
        j = -1;
        while(++j < segments)
        {
            index0 = j + i * (segments + 1);
            index1 = index0 + segments + 1;
            index2 = index0 + 1;

            indices.push(index0,index1,index2);

            index2 = index0 + 1;
            index0 = index1;
            index1 = index0 + 1;

            indices.push(index0,index1,index2);
        }
    }

    this._bVertexSphere       = new Float32Array(vertices);
    this._bVertexSphereScaled = new Float32Array(vertices);
    this._bNormalSphere       = new Float32Array(normals);
    this._bColorSphere        = new Float32Array(vertices.length / 3 * 4);
    this._bTexCoordsSphere    = new Float32Array(indices);
    this._bIndexSphere        = new Uint16Array(indices);
};

FGL.prototype._genCircle = function()
{
    var cx = 0,
        cy = 0;

    var d = this._circleDetailLast,
        v = this._bVertexCircle,
        l = d * 3;

    var i = 0;

    var theta = 2 * Math.PI / d,
        c = Math.cos(theta),
        s = Math.sin(theta),
        t;

    var ox = 1,
        oy = 0;

    while(i < l)
    {
        v[i  ] = ox + cx;
        v[i+1] = 0;
        v[i+2] = oy + cy;

        t  = ox;
        ox = c * ox - s * oy;
        oy = s * t  + c * oy;

        i+=3;
    }
};

/*---------------------------------------------------------------------------------------------------------*/
// default vbo/ibo / shader attributes
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.getDefaultVBO  = function(){return this._defaultVBO;};
FGL.prototype.getDefaultIBO  = function(){return this._defaultIBO;};
FGL.prototype.bindDefaultVBO = function(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this._defaultVBO);};
FGL.prototype.bindDefaultIBO = function(){this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this._defaultIBO);};

FGL.prototype.getDefaultVertexAttrib   = function(){return this._cprogram.aVertexPosition;};
FGL.prototype.getDefaultNormalAttrib   = function(){return this._cprogram.aVertexNormal;};
FGL.prototype.getDefaultColorAttrib    = function(){return this._cprogram.aVertexColor;};
FGL.prototype.getDefaultTexCoordAttrib = function(){return this._cprogram.aVertexTexCoord;};

FGL.prototype.enableDefaultVertexAttribArray     = function(){this.gl.enableVertexAttribArray(this._cprogram.aVertexPosition);};
FGL.prototype.enableDefaultNormalAttribArray     = function(){this.gl.enableVertexAttribArray(this._cprogram.aVertexNormal);};
FGL.prototype.enableDefaultColorAttribArray      = function(){this.gl.enableVertexAttribArray(this._cprogram.aVertexColor);};
FGL.prototype.enableDefaultTexCoordsAttribArray  = function(){this.gl.enableVertexAttribArray(this._cprogram.aVertexTexCoord);};

FGL.prototype.disableDefaultVertexAttribArray    = function(){this.gl.disableVertexAttribArray(this._cprogram.aVertexPosition);};
FGL.prototype.disableDefaultNormalAttribArray    = function(){this.gl.disableVertexAttribArray(this._cprogram.aVertexNormal);};
FGL.prototype.disableDefaultColorAttribArray     = function(){this.gl.disableVertexAttribArray(this._cprogram.aVertexColor);};
FGL.prototype.disableDefaultTexCoordsAttribArray = function(){this.gl.disableVertexAttribArray(this._cprogram.aVertexTexCoord);};


FGL.prototype.useDefaultProgram = function()
{
    this.useProgram(this._programDefault);
};

FGL.prototype.useProgram = function(program)
{
    if(program == this._cprogram)return;

    this._cprogramLast = this._cprogram;
    this.gl.useProgram(program.program);
    program.enableVertexAttribArrays(this);
    this._cprogram = program;
};

//naa, need better name
FGL.prototype.restoreProgram = function(){this.useProgram(this._cprogramLast);};

FGL.prototype.deleteProgram = function(program)
{
    var gl = this.gl;
        gl.deleteShader(program.vertShader);
        gl.deleteShader(program.fragShader);
        gl.deleteProgram(program.program);
};

FGL.prototype.getProgram = function(){return this._cprogram;};


/*---------------------------------------------------------------------------------------------------------*/
// convenience draw
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.box = function(width,height,depth)
{
    width  = (typeof width  == 'undefined') ? 1.0 : width;
    height = (typeof height == 'undefined') ? 1.0 : height;
    depth  = (typeof depth  == 'undefined') ? 1.0 : depth;

    var boxWidthLast  = this._boxWidthLast,
        boxHeightLast = this._boxHeightLast,
        boxDepthLast  = this._boxDepthLast;

    var bVertexBox       = this._bVertexBox,
        bVertexBoxScaled = this._bVertexBoxScaled;

    this.drawElements((width  == 1 &&
                       height == 1 &&
                       depth  == 1) ?
                           bVertexBox :
                      (width  == boxWidthLast  &&
                       height == boxHeightLast &&
                       depth  == boxDepthLast) ?
                           bVertexBoxScaled :
                       this._scaleVertices3f(bVertexBox,
                                             width,height,depth,
                                             bVertexBoxScaled),
                       this._bNormalBox,
                       this.bufferColors(this._bColor,this._bColorBox),
                       this._bTexCoordBox,
                       this._bIndexBox,
                       this._drawMode,
                       this._bIndexBox.length,
                       0,
                       this.UNSIGNED_SHORT);

    this._boxWidthLast  = width;
    this._boxHeightLast = height;
    this._boxDepthLast  = depth;

    this._drawFuncLast = this.box;
};

FGL.prototype.cube = function(size)
{
    size = typeof size === 'undefined' ? 1.0 : size;

    if(size == 0)return;

    var cubeScaleLast     = this._cubeScaleLast,
        bVertexCube       = this._bVertexCube,
        bVertexCubeScaled = this._bVertexCubeScaled;

   this.drawElements((size == 1) ?
                        bVertexCube :
                     (size == cubeScaleLast) ?
                         bVertexCubeScaled :
                            this._scaleVertices1f(bVertexCube,
                                                  size,
                                                  bVertexCubeScaled),
                     this._bNormalCube,
                     this.bufferColors(this._bColor,this._bColorCube),
                     this._bTexCoordCube,
                     this._bIndexCube,
                     this._drawMode,
                     this._bIndexCube.length,
                     0,
                     this.UNSIGNED_SHORT);


    this._cubeScaleLast = size;
    this._drawFuncLast  = this.cube;
};

FGL.prototype.sphere = function(size)
{
    size = (typeof size === 'undefined') ? 1.0 : size;

    if(size == 0)return;

    var sphereScaleLast     = this._sphereScaleLast,
        bVertexSphere       = this._bVertexSphere,
        bVertexSphereScaled = this._bVertexSphereScaled;

    this.drawElements((size == 1) ?
                        bVertexSphere :
                      (size == sphereScaleLast) ?
                        bVertexSphereScaled :
                            this._scaleVertices1f(bVertexSphere,
                                                  size,
                                                  bVertexSphereScaled),
                      this._bNormalSphere,
                      this.bufferColors(this._bColor,this._bColorSphere),
                      this._bTexCoordsSphere,
                      this._bIndexSphere,
                      this._drawMode,
                      this._bIndexSphere.length,
                      0,
                      this.UNSIGNED_SHORT);


    this._sphereScaleLast = size;
    this._drawFuncLast    = this.sphere;
};

/*---------------------------------------------------------------------------------------------------------*/
// Get geom buffers - TEMP -
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.getGeomBufferSphere = function()
{
    return [new Float32Array(this._bVertexSphere),
            new Float32Array(this._bNormalSphere),
            new Float32Array(this._bColorSphere),
            new Float32Array(this._bTexCoordsSphere),
            Flags.__uintTypeAvailable ? new Uint16Array(this._bIndexSphere) :
                                        new Uint8Array( this._bIndexSphere)];
};

FGL.prototype.getGeomBufferQuad = function()
{
    return [this._bVertexQuad,
            this._bNormalQuad,
            this._bColorQuad,
            this._bTexCoordQuad];
};

/*---------------------------------------------------------------------------------------------------------*/
// ...
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.setAlphaBlending = function(bool,premultiplied)
{
    var gl = this.gl;
    if(!bool){gl.disable(gl.BLEND);return;}

    gl.enable(gl.BLEND);
    if(premultiplied)gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    else gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
};


/*---------------------------------------------------------------------------------------------------------*/
// expose gl stuff
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype.enable                = function(id){this.gl.enable(id);};
FGL.prototype.disable               = function(id){this.gl.disable(id);};

FGL.prototype.blendColor            = function(r,g,b,a){this.gl.blendColor(r,g,b,a);};
FGL.prototype.blendEquation         = function(mode){this.gl.blendEquation(mode);};
FGL.prototype.blendEquationSeparate = function(sfactor,dfactor){this.gl.blendEquationSeparate(sfactor,dfactor);};
FGL.prototype.blendFunc             = function(sfactor,dfactor){this.gl.blendFunc(sfactor,dfactor);};
FGL.prototype.blendFuncSeparate     = function(srcRGB,dstRGB,srcAlpha,dstAlpha){this.gl.blendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha);};
FGL.prototype.depthFunc             = function(func){this.gl.depthFunc(func);};
FGL.prototype.sampleCoverage        = function(value,invert){this.gl.sampleCoverage(value,invert);};
FGL.prototype.stencilFunc           = function(func,ref,mask){this.gl.stencilFunc(func,ref,mask);};
FGL.prototype.stencilFuncSeparate   = function(face,func,ref,mask){this.gl.stencilFuncSeparate(face,func,ref,mask);};
FGL.prototype.stencilOp             = function(fail,zfail,zpass){this.gl.stencilOp(fail,zfail,zpass);};
FGL.prototype.stencilOpSeparate     = function(face,fail,zfail,zpass){this.gl.stencilOpSeparate(face,fail,zfail,zpass);};



//convenient bindings, for now every function in conflict is prefixed with gl, odd

FGL.prototype.createTexture = function()              {return this.gl.createTexture();};
FGL.prototype.bindTexture   = function(target,texture){this.gl.bindTexture(target,texture);};

FGL.prototype.uniform1i  = function(location,x)      {this.gl.uniform1i(location,x);};
FGL.prototype.uniform2i  = function(location,x,y)    {this.gl.uniform2i(location,x,y);};
FGL.prototype.uniform3i  = function(location,x,y,z)  {this.gl.uniform3i(location,x,y,z);};
FGL.prototype.uniform4i  = function(location,x,y,z,w){this.gl.uniform4i(location,x,y,z,w);};

FGL.prototype.uniform1iv = function(location,v)      {this.gl.uniform1iv(location,v);};
FGL.prototype.uniform2iv = function(location,v)      {this.gl.uniform2iv(location,v);};
FGL.prototype.uniform3iv = function(location,v)      {this.gl.uniform3iv(location,v);};
FGL.prototype.uniform4iv = function(location,v)      {this.gl.uniform4iv(location,v);};

FGL.prototype.uniform1f = function(location,x)      {this.gl.uniform1f(location,x);};
FGL.prototype.uniform2f = function(location,x,y)    {this.gl.uniform2f(location,x,y);};
FGL.prototype.uniform3f = function(location,x,y,z)  {this.gl.uniform3f(location,x,y,z);};
FGL.prototype.uniform4f = function(location,x,y,z,w){this.gl.uniform4f(location,x,y,z,w);};

FGL.prototype.uniform1fv = function(location,v)      {this.gl.uniform1fv(location,v);};
FGL.prototype.uniform2fv = function(location,v)      {this.gl.uniform2fv(location,v);};
FGL.prototype.uniform3fv = function(location,v)      {this.gl.uniform3fv(location,v);};
FGL.prototype.uniform4fv = function(location,v)      {this.gl.uniform4fv(location,v);};

FGL.prototype.uniformMatrix2fv = function(location,transpose,value){this.gl.uniformMatrix2fv(location,transpose,value);}
FGL.prototype.uniformMatrix3fv = function(location,transpose,value){this.gl.uniformMatrix3fv(location,transpose,value);}
FGL.prototype.uniformMatrix4fv = function(location,transpose,value){this.gl.uniformMatrix4fv(location,transpose,value);}

FGL.prototype.vertexAttrib1f = function(index,x)      {this.gl.vertexAttrib1f(index,x)};
FGL.prototype.vertexAttrib2f = function(index,x,y)    {this.gl.vertexAttrib2f(index,x,y);};
FGL.prototype.vertexAttrib3f = function(index,x,y,z)  {this.gl.vertexAttrib3f(index,x,y,z);};
FGL.prototype.vertexAttrib4f = function(index,x,y,z,w){this.gl.vertexAttrib4f(index,x,y,z,w);};

FGL.prototype.vertexAttrib1fv = function(index,values){this.gl.vertexAttrib1fv(index,values);};
FGL.prototype.vertexAttrib2fv = function(index,values){this.gl.vertexAttrib2fv(index,values);};
FGL.prototype.vertexAttrib3fv = function(index,values){this.gl.vertexAttrib3fv(index,values);};
FGL.prototype.vertexAttrib4fv = function(index,values){this.gl.vertexAttrib4fv(index,values);};

FGL.prototype.disableVertexAttribArray = function(index){this.gl.disableVertexAttribArray(index);};
FGL.prototype.enableVertexAttribArray  = function(index){this.gl.enableVertexAttribArray(index);};
FGL.prototype.vertexAttribPointer      = function(index,size,type,normalized,stride,offset){this.gl.vertexAttribPointer(index,size,type,normalized,stride,offset);}

FGL.prototype.bufferData    = function(target,data,usage){this.gl.bufferData(target,data,usage);};
FGL.prototype.bufferSubData = function(target,offset,data){this.gl.bufferSubData(target,offset,data);}

FGL.prototype.glDrawArrays   = function(mode,first,count){this.gl.drawArrays(mode,first,count);};
FGL.prototype.glDrawElements = function(mode,count,type,offset){type.gl.drawElements(mode,count,type,offset);};

FGL.prototype.glUseProgram = function(program){this.gl.useProgram(program);};

/*---------------------------------------------------------------------------------------------------------*/
// Framebuffer
/*---------------------------------------------------------------------------------------------------------*/

FGL.prototype._prepareFramebuffer = function()
{

};

FGL.prototype._renderFramebuffer = function()
{

};



/*---------------------------------------------------------------------------------------------------------*/
// World -> Screen
/*---------------------------------------------------------------------------------------------------------*/

//TODO: Fix me
FGL.prototype.getScreenCoord3f = function(x,y,z)
{
    var mpm = Mat44.mult(this._camera.projectionMatrix,this._mModelView);
    var p3d = Mat44.multVec3(mpm,Vec3.make(x,y,z));

    var bsc = this._bScreenCoords;
    bsc[0] = (((p3d[0] + 1) * 0.5) * window.innerWidth);
    bsc[1] = (((1 - p3d[1]) * 0.5) * window.innerHeight);

    return bsc;
};

FGL.prototype.getScreenCoord = function(v)
{
    return this.getScreenCoord3f(v[0],v[1],v[1]);
};




FGL.prototype.getModelViewMatrix  = function(){return this._mModelView;};
FGL.prototype.getProjectionMatrix = function(){return this._camera.projectionMatrix;};







module.exports = FGL;