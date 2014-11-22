#!/usr/bin/env node

var colors = require('colors'),
	argv   = require('minimist')(process.argv.slice(2),{string:['p','t'],boolean:['s','w']});

function logUsageAndExit(){
	console.log('Usage: new -p [path] -t [template] [-s]'.blue);
	process.exit();
}

if(argv.h || argv.help || !argv.p || !argv.t){
	logUsageAndExit();
}

if(argv.p.length == 0){
	console.log('✗   No path supplied!'.red);
	logUsageAndExit();
}

var projectType = argv.t;
var templates = ['basic2d', 'basic3d', 'basic3dTexture', 'basic3dLight'];

if(!projectType.length){
	console.log('✗   No template type supplied!'.red);
	logUsageAndExit();
} else if(templates.indexOf(projectType) == -1) {
	console.log(("✗   Wrong template type '" + projectType + "'!").red);
	console.log(('    Use ' + templates.join(', ')).red);
	process.exit();
}

var fs   = require('fs'),
	path = require('path');

function dir(path){
	if(!fs.existsSync(path)){
		fs.mkdirSync(path);
	}
	return path;
}

function write(path,src){
	fs.writeFileSync(path,src);
}

function read(path){
	return fs.readFileSync(path,'utf8');
}

function p(path_,add){
	return path.join(path_,add);
}

var pathProject    = dir(path.resolve(argv.p)),
	pathProjectSrc = pathProject,
	pathTemplates  = p(__dirname,'templates'),
	pathResources  = p(__dirname,'../resources'),
	shaderFile,
	pathShader,
	pathAppjs;

var srcOnly = argv.s;

if(!srcOnly){
	write(p(pathProject,'index.html'),read(p(pathTemplates,'index.html')));
	pathProjectSrc = dir(p(pathProject,'src'));
} else {
	console.log('    Generating project without index.html.'.blue);
}

shaderFile = 'program.glsl';
pathShader = p(pathProjectSrc, shaderFile);
pathAppjs  = p(pathProjectSrc, 'app.js');

write(pathShader,read(p(pathResources,projectType + '.glsl')));
write(pathAppjs, read(p(pathTemplates,projectType + '.js')).replace('PATH_TO_SHADER','"' + p(srcOnly ? '.' : 'src',shaderFile) + '"'));

console.log(('✓   Project of type ' + projectType +' generated at: ' + pathProject).yellow);

if(argv.w){
	var args = [pathAppjs,'-o',p(pathProject,'bundle.js'),'-d','-v'];
	console.log(('    watchify ' + args.join(' ')).yellow);

	var child = require('child_process').spawn('watchify',args);
		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);
}