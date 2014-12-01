DRAFT & STILL EXPERIMENTAL

#FOAM - A WebGL toolkit

Foam is a condensed collection of tools for building procedural graphics in WebGL.   
It tries to be as 'low'-level as possible (in a browser/js sense) but still handles and abstracts repetitive tasks such as scene, animation loop and user input setup, and provides thin abstractions for commonly used scene related objects such as cameras, textures, basic geometry, light and material representations as well as WebGL objects like shader programs, vbos, fbos and others.

*Foam expects you having solid knowledge in WebGL and shader development*, so if you don't want to deal with shaders and just quickly display your mesh using some predefined material and lighting, this might not be your weapon of choice.


[Advantages & Disadvantages](#advantages--disadvantages) – [Goals](#goals) – [Structure](#structure) – [Install](#install) - [Usage](#usage) – [Templates](#templates) – [Build](#build) – [Documentation](#documentation) – [Dependencies](#dependencies) – [License](#license)

---



##Advantages & Disadvantages 

- Foam has a very thin abstraction layer, which allows you to **safely access any 'bare-bone' WebGL functionality** you need (except shader program binding) without breaking any Foam internal states.
- Foam **focuses on writing shaders**. So compared to other libraries or frameworks you won't find any prepackaged materials, complex lighting and shadowing setups or post-processing filters. Thats your job. – But there a tiny shader templates to get you started.
- Although you can load external models, Foam mainly **focuses on programmatically generating geometry**.
- Loading every resource asynchronously on scene init can be quite cumbersome, especially when dealing with multiple glsl files, texture images and additional resources. Foam uses a **resource bundle loader** which you can feed with a list of resources. It will load all of them, report errors and after completely processing the list init your program with a resource dictionary. This is not mandatory, you can still load and process every single resource on its own.
- Foam offers **wrappers around WebGL base objects** such as programs, vertex and index buffers, framebuffers  and textures.
- Foam reintroduces the **fixed pipeline matrix stack model**. Welcome back: glTranslate, glScale, glRotate, glMultMatrix, glPushMatrix and glPopMatrix as well as some additional matrix transformation methods.
- Sometimes its necessary to just quickly test a visual idea. Therefore Foam offers an optional **'immediate mode' style**, which allows drawing mesh data and 2d & 3d primitives without previously allocating any object. 
- Solid **text rendering of generated BitmapFonts** using the wonderful opentype.js – An OpenType and TrueType font parser.
- Foam uses the **common.js module pattern** via [browserify](http://browserify.org/)



###Differences to other tools

Foam is no magical all-in-one tool like Three.js (which is wonderful). It doesn't have additional render targets like 2d canvas, SVG or CSS3D or uses them as fallbacks. 

Foam doesnt provide any builtin optimisation of the render pipeline, no auto checking your cameras view frustum, auto lod or your ordering objects in a scene graph or providing giant uber shaders.

Foam mainly focuses on generating procedural graphics – this often requires very specific and individual approaches depending on your design goals. When moving calculations or geometry modifications to the gpu, Foam provides an elegant interface between your shaders and js application.  



##Goals

Foam tries to be as generic and structurally open as possible by not forcing you to adopt a certain way of building your scenes or managing the objects within it.
You may choose to use the builtin geometry or light representations or simply drop them and just use Foam for setting up your app and resources and write everything with raw WebGL calls. If you need a scene graph, build it on top. – This **flexibility is a core idea** of Foam. – Therefore *Foam will never compete with WebGL frameworks* like Three.js or others.

Additional functionalities may be added with extensions.



##Structure

- ***App core*** – Canvas setup, user input, resource bundle handling and update loop setup
- ***Graphics*** – Offers aforementioned cameras (perspective, orthographic, frustum and arcball rotation), generic material & light representations and geometry models which can be extended with custom attributes and uniforms, as well as text rendering, 'immediate mode' drawing via *glDraw*, and matrix stack manipulation via *glTrans*. Basic access to drawing methods, transformations and raw WebGL can be gained by inheriting from *glObject*.
- ***WebGL objects*** – Shader program, vbo, fbo, textures
- **Geometry** – Axis aligned bounding boxes, planes, rectangles, to be extended
- ***Math*** – 2d & 3d vectors, matrices, quaternions and utilities
- ***Extras*** – Color representation, Filewatcher, WebWorker console



##Install

Context Node (not yet published)
    
    npm install foam-gl

Context html (browserified standalone)

    <script type="text/javascript" src="foam.js"></script>
  
    



##Usage

A typical project structure is as follows:


    project/
    |
    |-- src/
    |   |-- app.js        //your application
    |   |-- program.glsl  //the main shader
    |
    |-- index.html  //minimum html
    |-- bundle.js   //browserified app.js

With a **minimum html boilerplate**:

    <!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <script src="bundle.js"></script>
        <style>
            html,body{margin: 0;padding: 0;}
            canvas{vertical-align: bottom;}
        </style>
    </head>
    <body>
    </body>
    </html>


And **app.js**:

    var Foam = require('foam-gl');
    
    var CameraPersp = Foam.CameraPersp,
        Program     = Foam.Program,
        Texture     = Foam.Texture,
        Vec3        = Foam.Vec3;

    //inits app with ressources on window load 
    Foam.App.newOnLoadWithResources({ 
        // Resource obj
        shader : {path:pathToShader},
        image  : {path:pathToImage,type:'image'},
    },{ 
        // App obj
        setup : function(resources){
            this.setFPS(60); 
            this.setWindowSize(800,600);
            
            this._program = new Program(resources.shader);
            this._program.bind();
            
            this._texture = Texture.createFromImage(resources.image);
            
            this._program.uniform1i('uTexture', this._texture.getUnit());
                
            this._camera = new CameraPersp();
            this._camera.setAspectRatio(this.getAspectRatio());
            this._camera.lookAt(Vec3.one(),Vec3.zero());
            this._camera.updateMatrices();
            
            var gl = this._gl;
            
            gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());    
            gl.clearColor(0.25,0.25,0.25,1.0);
            gl.enable(gl.DEPTH_TEST);    
        },
        
        update : function(){
            var gl      = this._gl,
                glTrans = this._glTrans,
                glDraw  = this._glDraw;
            
            var camera  = this._camera;
            var program = this._program;
            var t = this.getSecondsElapsed();
            
            gl.clear(gl.BUFFER_BIT | gl.DEPTH_BIT);
            
            camera.setDistance((0.5 + Math.sin(t) * 0.5) * 2.0);
            camera.updateViewMatrix();
            
            glTrans.setCameraMatrices(camera);
                
            program.uniform1f('uUseTexture',0.0);
                
            glDraw.drawPivot();
            
            program.uniform1f('uUseTexture',1.0);
            
            glTrans.pushMatrix();
            glTrans.translate3f(0,Math.sin(t * 0.5),0);
            glTrans.rotate3f(t,0,0);
            glDraw.drawCubeColored(); // draw test cube
            glTrans.popMatrix();
        }
    });
    
Which equals (regarding application initialisation):

    var Foam = require('foam-gl');
    
    function App(canvas,resources){
        Foam.App.apply(this,arguments);
    }
    App.prototype = Object.create(Foam.App.prototype);
    App.prototype.constructor = App;
    
    App.prototype.setup  = function(resources){}
    App.prototype.update = function(){};
    
    window.addEventListener('load',function(){
        var app;
        Foam.Resource.load(
            { // Resource obj
                shaderA : {path:pathToShaderA},
                shaderB : {path:pathToShaderB}
            },
            function(resources){
                app = new App(null,resources);
            }
    });
    
    
####Context node-webkit
    
- browserify app.js, gen index.html / package.son, zip it, run nodeWebkit, start remote debug session
- buildNodeWebkit.sh
- [more]

####Context node-webgl

- [more]

##Templates

*(will change)*
Foam offers project templates to get you started quickly. It generates an index.html and src folder containing a program.glsl and app.js file depending on the template type you provide. 

    scripts/new -p newProjectPath -t [TEMPLATE] [-s] [-w]
    


| Arg  | Value    | Description                                                 |
| ---- | -------- | ----------------------------------------------------------- |
| -o   | path     | path of the new project                                     |
| -t   | template | glsl & app.js template: basic2d, basic3d, basic3dTexture, basic3dLight |            
| -s   |          | only creates app.js & program.glsl (optional)               |
| -w   |          | watchify app.js (optional)                                  |


##Build

*(will change)*

    browserify index.js -o pathOut -s foam-gl -d


##Dependencies

[Opentype](https://github.com/bramstein/opentype) – A JavaScript parser for TrueType and OpenType fonts  
[Minimist](https://github.com/substack/minimist) - Argument parser    
[Watchify](https://github.com/substack/watchify) - Update any source file and your browserify bundle will be recompiled on the spot.


##License


MIT License

Copyright (c) 2013 - 2014 Henryk Wollik. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to, use copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


