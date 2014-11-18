####DRAFT – EXPERIMENTAL

#FOAM - A WebGL tookkit

- [...]
- used to plain gl calls

[Features](#feature)  – [Differences to other tools](#differences) - [Goals](#goals) - [Structure](#structure) - [Install](#install) - [Usage](#usage) - [Templates](#templates) – [Build](#build) – [Dependencies](#dependencies)

##Features

- thin abstraction layer
- safe bare-bone gl access anytime (except program binding)
- focused on writing shaders
- focus on procedural scenes
- resource management
- convenience wrappers around gl base objects, ...
- optional 'immediate mode' style, for fast sketching
- OpenGL 2.x like matrix stack, glTranslate, glRotate, gl...
- event system
- no framework!
- browserified
- [more]

##Differences to other tools

- there is more to WebGL than Three.js
- no scene graph
- [more]

##Goals

- Overall Goal


- [Future here]

##Structure

- [Structure here]
- glObject
- glDraw

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
                this._camera.lookAt(Vec3.one(),Vec3.zero();
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
                glTrans.translate3f(-2,0,0);
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

##Templates

- Shader & project templates

##Build

##Dependencies

[Opentype](https://github.com/bramstein/opentype) – A JavaScript parser for TrueType and OpenType fonts




