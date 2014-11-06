#!/bin/bash

# IDE - shortcut
# buildNodeWebkit - Browserify app.js, gen index.html / package.json, zip all, run NodeWebkit

((!$#)) && echo "PATH_TO_APP_JS PATH_TO_TEMP_DIR PATH_TO_NODE_WEBKIT(optional) missing" && exit 1

args=("$@")

((${#args[@]}<2)) && echo "Args missing. Must satisfy PATH_TO_APP_JS PATH_TO_TEMP_DIR PATH_TO_NODE_WEBKIT(optional)" && exit 1

pathjs=${args[0]}
filejs=$(basename "${pathjs}")
patht=${args[1]}

if [ "${filejs#*.}" != "js" ]
then
	echo "no .js file!"
	exit 1
else
	if [ -d "$patht" ]
	then
    	
    	rm -rf "$patht"/*
    	cd "$patht"

    	cat > ./index.html <<- _EOF_
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
		_EOF_

		cat > ./package.json <<- _EOF_
		{
			"main"        : "index.html",
			"name"        : "-",
			"description" : "-",
			"window" :
			{
				"position"   : "center",
                "toolbar"    : false,
                "frame"      : false,
                "min_width"  : 800,
                "min_height" : 600
            }
        }
		_EOF_

		browserify "$pathjs" -i plask > ./bundle.js
		
		zip app.nw index.html bundle.js package.json

		rm -f index.html
		rm -f bundle.js
		rm -f package.json

		if [ ${#args[@]} -eq 3 ];then
			open -a "${args[2]}" app.nw
		fi

	    echo "Done!"
	    exit 0

	else
    	echo "Temp Directory doesnt exist"
    	exit 1
	fi
fi