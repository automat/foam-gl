var ObjLoader = {};

/**
 *
 * Parses obj file string, returns
 *
 * {objects : [{vertices,normals,texcoords,indices,materialDesc},...],
 *  totalTriangles : }
 *
 */

var OBJ_VERTEX = 'v',
    OBJ_NORMAL = 'vn',
    OBJ_TEX_COORD = 'vt',
    OBJ_FACE = 'f',
    OBJ_COMMENT = '#',
    OBJ_BLANK = '',
    OBJ_USE_MTL = 'usemtl',
    OBJ_MTL_LIB = 'mtllib',
    OBJ_OBJECT = 'o',
    OBJ_GROUP = 'g',
    OBJ_SCALE = 's';

var OBJ_COMP_DIV = '/';

function append(a,b){
    Array.prototype.push.apply(a,b);
}

ObjLoader.Load = function(objFileStr,callback){
    objFileStr = objFileStr.split('\n');

    var vertices  = [],
        normals   = [],
        texcoords = [];

    var objVertices  = [],
        objNormals   = [],
        objTexcoords = [],
        objIndices = [],
        objIndicesHash = {},
        objIndex = 0;


    var i = -1, l = objFileStr.length;
    var j, k;
    var line, tokens, firstToken, dataIndex;
    var faceToken, tokens_;


    while(++i < l){
        line   = objFileStr[i].trim();
        tokens = line.split(' ');
        firstToken = tokens.shift();

        switch (firstToken){
            // Vertex
            case OBJ_VERTEX:
                append(vertices,tokens);
                break;

            // Normal
            case OBJ_NORMAL:
                append(normals,tokens);
                break;

            // Texcoord
            case OBJ_TEX_COORD:
                append(texcoords,tokens);
                break;

            // Face
            case OBJ_FACE:
                if(tokens.length != 3){
                    throw new Error('Only triangle faces are currently supported');
                }
                // face token = per vertex (vertex, normal & texcoord index)
                j = -1; k = 3;
                while(++j < k){
                    // token[0] == vertex index
                    // token[1] == texture index
                    // token[2] == normal index
                    // index = index - 1, as obj format starts at 1
                    faceToken = tokens[j];
                    if(!objIndicesHash[faceToken]){
                        tokens_ = faceToken.split(OBJ_COMP_DIV);

                        // vertices
                        dataIndex = (tokens_[0] - 1) * 3;
                        objVertices.push(vertices[dataIndex++],
                                         vertices[dataIndex++],
                                         vertices[dataIndex  ]);
                        // normals
                        dataIndex = (tokens_[2] - 1) * 3;
                        objNormals.push(normals[dataIndex++],
                                        normals[dataIndex++],
                                        normals[dataIndex  ]);

                        // texcoords
                        if(texcoords.length != 0){
                            dataIndex = (tokens_[1] - 1) * 2;
                            objTexcoords.push(texcoords[dataIndex++],
                                              texcoords[dataIndex  ]);
                        }

                        objIndicesHash[faceToken] = objIndex;
                        objIndices.push(objIndex++);

                    } else { //already processed
                        objIndices.push(objIndicesHash[faceToken]);
                    }
                }
                break;

            // Material name for object
            case OBJ_USE_MTL:
                break;

            // An object group - IGNORED
            case OBJ_GROUP:
                break;

            // A saperate object
            case OBJ_OBJECT:
                break;

            // An objects scale
            case OBJ_SCALE:
                break;

            // A comment – IGNORED
            case OBJ_COMMENT:
                break;

            // Blank line – IGNORED
            case OBJ_BLANK:
                break;

            default :
                break;
        }
    }

    callback({
        vertices: objVertices,
        normals: objNormals,
        texcoords: objTexcoords,
        indices: objIndices
    });
};

module.exports = ObjLoader;