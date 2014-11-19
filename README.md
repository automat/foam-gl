####DRAFT & STILL EXPERIMENTAL

#FOAM - A WebGL toolkit

- [...]
- used to plain gl calls

[Features](#feature)  – [Differences to other tools](#differences) - [Goals](#goals) - [Structure](#structure) - [Install](#install) - [Usage](#usage) - [Templates](#templates) – [Build](#build) – [Dependencies](#dependencies) - [License](#license)

##Features

- thin abstraction layer
- safe bare-bone gl access anytime (except program binding)
- focused on writing shaders
- focus on procedural scenes
- resource management 
- convenience wrappers around gl base objects, ...
- optional 'immediate mode' style, for fast sketching
- OpenGL 2.x like matrix stack, glTranslate, glRotate, gl...
- flexible, because shader focused, write pure 2d scene shader?, go
- event system
- no framework!
- browserified, node.js modules
- [more]

##Differences to other tools

- focus on base gl
- there is more to WebGL than Three.js
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


