0.0.6 / 2015-02-14
==================

  * package.json update publish
  * glDraw added drawOnB
  * OnB added setf
  * index.js export OnB
  * Ease cleanup
  * VboMesh added get{Vertices,Normals,Colors,Texcoords,Indices}Length
  * Mesh added get{Vertices,Normals,Colors,Texcoords,Indices}Length
  * Ease added none
  * VboMesh added append{Vertices,Normals,Colors,Texcoords,Indices}
  * Mesh added append{Vertices,Colors,Normals,Texcoords,Indices}, doc++
  * index.js update Time
  * Time initial
  * App moved internal time handling to Time
  * Color added to{RGBA,RGB}String
  * Merge branch 'master' of https://github.com/automat/Foam
  * Deleted async
  * Delete async,
  * AABB added option relative to normalize{Points,Pointsf}
  * Ease misc optimizations
  * Vec3 added toAbs, abs
  * Vec2 added toAbs, abs
  * AABB added get{MinMin,MaxMax}, normalize
  * 09_Draw_Immediate_2d fixed module import, initial random velocity
  * AABB added setMinMax{f,fv}, fromMinMax{f,fv}
  * 13_FileWatcher initial
  * Color added setHSV
  * Fixed async in commit msg
  * FileWatcher sync -> async, caused by sync XMLHttpRequest getting deprecated on the main thread
  * Light fixed setCustomUniform4 w set
  * ObjLoader fixed options skip
  * Color changed constructor, set{i,f} to more flexible rgba pass
  * Light added isEnabled, removed color set from debugDraw, moved to static temps
  * VboMesh added returns, doc++
  * Matrix44 added setTranslation, fromScalef
  * Mouse doc++
  * App added options
  * 03_Fbo fixed whitespaces
  * Rect isEqual => equals
  * glDraw itr++
  * glDraw added drawLine{Part,Partf}, fixed missing attribLocation check on drawPoints, fixed drawLineStripf color
  * AABB fixed param out from{Points, Pointsf}, doc++
  * AABB added setMinMax
  * update 2015
  * AABB added reset, include{Pointf,Point}
  * CameraOrbiter added getDistance{Min,Max}
  * glDraw drawCube removed unnecessary disableVertexAttribArray
  * Fbo fixed width & height set on resize, added returns
  * Program added returns, default UNIFORM_SKYBOX
  * App fixed Firefox mouse drag
  * index.js added Matrix33 export
  * Matrix33 added setFrom{Scale,Scalef,Rotation,Translationf}, mult{Vec2,Vec2f}
  * Color added copy, lerp
  * Vec2 added direction
  * AABR fixed center and rect points calc, args naming fromPoints & fromPointsf
  * Vec2 added lerp,lerped,slerp,slerped
  * index.js update
  * AABR initial
  * AABB removed NORM_RANGE
  * AABB fixed get{X,Y}RangeNormalized
  * Vec2 added set1f, add1f, sub1f, cross, interpolateTo, interpolatedTo, toZero, isZero, toOne, random, randomDirection
  * Vec3 removed set{X,Y,Z}, added set1f, fixed docs
  * added Texture video support, removed ObjectUtil
  * added CameraAbstract get{Near,Far,Fov}
  * fixed Vec3 random arguments override
  * added Vec3 {add,sub}1f, prototype random,randomDirection, cleanup static methods
  * added Fbo resizef & resize
  * added CameraOrbiter getDistanceNormalized
  * temp fix ObjLoader no texcoords
  * fixed AABB getXYZRange out constructor
  * added AABB get{X,Y,Z}Range, get{X,Y,Z}RangeNormalized, normalizePoints{f}
  * fixed Mesh getBoundingBox optional out param naming
  * fixed AABB setFromPointsf
  * fixed ObjLoader wrong options check order
  * added ObjLoader 'plain' option, changed param order
  * added glDraw drawGridPoints
  * fixed Vec3 randomPosition
  * fixed Vec2 randomPosition
  * changed Vec3 to use Random module
  * changed Vec2 to use Random module, fixed optional params
  * added Random null seed check
  * added CameraOrbiter constrainDistanceTarget on distance set min/max
  * added {Mesh,VboMesh}Primitive Disk
  * added Vbo return this on unbind
  * renamed Texture create{Blank,FromImage,FromRandom} => from{Blank,Image,Random}
  * added ObjLoader optional group merge
