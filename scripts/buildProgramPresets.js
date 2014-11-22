#!/usr/bin/env node

var fs = require('fs');

var path = '../resources',
	dir = fs.readdirSync(path);
var name,
	content,
	file = 'var ProgramPreset = {};\n\n';

var i,j,l,m;

i = -1; l = dir.length;
while(++i < l){
	name = dir[i];
	if(name[0] == '_'){
		continue;
	}
	content = fs.readFileSync(path + '/' + name,{encoding:'utf8'}).split('\n');
	name    = name.slice(0,name.indexOf('.'));
	file   += 'ProgramPreset.' + name[0].toUpperCase() + name.substring(1) + ' = \n';

	j = -1; m = content.length-1;
	while(++j < m){
		file += '"' +  content[j] + '\\n" + \n';
	}
	file += '"' +  content[m] + '";\n\n';
}

file += 'module.exports = ProgramPreset;';

fs.writeFile('../lib/gl/ProgramPreset.js',file, function (err) {
	if(err){
		console.log(err);
		return;
	}
	console.log('done.');
});
