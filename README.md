####DRAFT & STILL EXPERIMENTAL

#FOAM - A WebGL toolkit

Foam is a condensed collection of tools for building procedural graphics in WebGL.   
It tries to be as 'low'-level as possible (in a browser/js sense) but still handles and abstracts repetitive tasks such as scene, animation loop and user input setup, and provides thin abstractions for commonly used scene related objects such as cameras, textures, basic geometry, light and material representations as well as WebGL objects like shader programs, vbos, fbos and others.

[more on why here]

--

If you don't want to deal with shaders and just quickly display your mesh using some predefined material and lighting, this might not be your weapon of choice.

[Advantages & Disadvantages](#advantages-&-disadvantages)  – [Differences to other tools](#differences-to-other-tools) - [Goals](#goals) - [Structure](#structure) - [Install](#install) - [Usage](#usage) - [Templates](#templates) – [Build](#build) – [Documentation](#documentation) – [Dependencies](#dependencies) - [License](#license)

---

##Advantages & Disadvantages 

- Foam has a very thin abstraction layer, which allows you to **safely access any 'bare-bone' WebGL functionality** you need (except shader program binding) without breaking any Foam internal states.

- Foam **focuses on writing shaders**. So compared to other libraries or frameworks you won't find any prepackaged materials, complex lighting and shadowing setups or post-processing filters. Thats your job. – But there a tiny shader templates to get you started.

- Altough you can load external models, Foam mainly **focuses on programmatically generating geometry**.

- Loading every resource asynchronously on scene init s***s, especially when dealing with multiple glsl files, texture images and additional resources. Foam uses a **resource bundle loader** which you can feed with a list of resources. It will load all of them, report errors and after completely processing the list init your program with a resource dictionary. This is not mandatory, you can still  load and process every single resource on its own.

- Foam offers some neat **wrappers around WebGL base objects** such as programs, vertex and index buffers, framebuffers  and textures.

- Foam reintroduces the **fixed pipeline matrix stack model**. Welcome back: glTranslate, glScale, glRotate, glMultMatrix, glPushMatrix and glPopMatrix as well as some additional matrix transformation methods.

- Sometimes its necessary to just quickly test a visual idea. Therefore Foam offsers an optional **'immediate mode' style**, which allows drawing mesh data and 2d & 3d primitives without previously allocating any object. 
 
- Math: **2d & 3d vectors**, **matrices**, **quaternions** and utilities

- Foam uses the common.js module pattern.

- [more]

##Differences to other tools

- Three.js is a wonderfull tool, but when 

- there is more to WebGL than Three.js (although its magical), abstracted just as much abstraction to not get in the way
- strong focus on shaders

There are no additional render targets, Foam is and will only be WebGL, no 2d canvas, SVG or CSS3D.


- no build-in uber giant shader, or materials, blank canvas
- Light and Material as generic representations of uniform shader structs, no associated programs, extendable with custom uniforms



- fd
- [more]

##Goals

- Overall Goal
- less dogmatic
- flexibility,keep core to a minimum

- additional functionality with extensions

- [Future here]

##Structure

- core: canvas handling, user input, resource bundle handling,  
- graphics: cameras, fbo, vbo, vbomeshes, easy text rendering with bitmap fonts via opentype.js, textures, light and material wrappers with custom uniforms
- math: ...
- extras: filewatchers



- [Structure here]

- glDraw : overall managing gl states when using builtin gl object wrappers (meshes, ...), 'immediate mode' drawing for fast sketching without initialising objects

- glTrans : model matrix stack

- glObject: base class, easy access glDraw, glTrans, gl


##Install

Context Node (not yet published)
    
    npm install foam-gl

Context html (browserified standalone)

    <script type="text/javascript" src="foam.js"></script>
  
    



##Usage

Minimum html boilerplate

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


Script

    var Foam = require('foam');
    
    var CameraPersp = Foam.CameraPersp,
        Program     = Foam.Program,
        Vec3        = Foam.Vec3;

    Foam.App.newOnLoadWithResources( //inits app with ressources on window load 
        { // Resource obj
            shaderA : {path:pathToShaderA},
            shaderB : {path:pathToShaderB},
            data : {path:pathToSomeData,type:'text'},
            onProgress : function(index,num){
                console.log('Resource loaded.' + index + ' / ' + num);
            }
        },
        { // App obj
            setup : function(resources){
                this.setFPS(60); // target 
                this.setWindowSize(800,600); //canvas size
            
                this._programA = new Program(resources.shaderA);
                this._programB = new Program(resources.shaderB);
                
                // do something with data
                
                this._camera = new CameraPersp();
                this._camera.lookAt(Vec3.one(),Vec3.zero());
                this._camera.updateMatrices();
            
                var gl = this._gl;
                gl.viewport(0,0,this.getWindowWidth(),this.getWindowHeight());    
                gl.enable(gl.DEPTH_TEST);    
            },
            update : function(){
                var gl = this._gl,
                    glTrans = this._glTrans,
                    glDraw  = this._glDraw;
                
                var t = this.getSecondsElapsed();
                
                gl.clear(gl.BUFFER_BIT | gl.DEPTH_BIT);
                gl.clearColor(0.25,0.25,0.25,1.0);
                
                glTrans.setCameraMatrices(this._camera);
                
                this._programA.bind();
                
                glTrans.pushMatrix();
                glTrans.translate3f(2,0,0);
                glTrans.rotate3f(t,0,0);
                glDraw.drawCubeColored(); // draw test cube
                glTrans.popMatrix();
                
                this._programB.bind(); // switch program
                this._programB.uniform1f('uTime',t);
                
                glTrans.pushMatrix();
                glTrans.translate3f(-2,0,0);
                glTrans.rotate3f(0,0,t);
                glDraw.drawCubeColored(); // draw test cube
                glTrans.popMatrix();
            }
        }
    );
    
equals (regarding application initialisation)

    var Foam = require('foam');
    
    function App(){
        Foam.App.call(this);
    }
    App.prototype = Object.create(Foam.App.prototype);
    App.prototype.constructor = App;
    
    App.prototype.setup = function(resources){}
    App.prototype.update = function(){};
    
    window.addEventListener('load',function(){
        var app;
        Foam.Resource.load(
            { // Resource obj
                shaderA : {path:pathToShaderA},
                shaderB : {path:pathToShaderB}
            },
            function(resources){
                app = new App(resources);
            }
    });
    
    
####Context node-webkit
    
- browserify app.js, gen index.html / package.son, zip it, run nodeWebkit, start remote debug session
- buildNodeWebkit.sh
- [more]

####Context node-webgl

- [more]

##Templates

- gen project with shader template: basic 2d, 3d, light

##Build

- standalone
- packaged with custom extensions

##Dependencies

[Opentype](https://github.com/bramstein/opentype) – A JavaScript parser for TrueType and OpenType fonts


##License


MIT License

Copyright (c) 2013 - 2014 Henryk Wollik. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to, use copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


