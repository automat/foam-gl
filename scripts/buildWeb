#!/bin/sh

# IDE - shortcut
# buildWeb - Browersify app.js, put bundle.js / index.html in clean temp folder,
#            open in browser.

((!$#)) && echo "PATH_TO_APP_JS PATH_TO_TEMP_DIR PATH_TO_BROWSER_APP(optional) missing" && exit 1

args=("$@")

((${#args[@]}<2)) && echo "Args missing. Must satisfy PATH_TO_APP_JS PATH_TO_TEMP_DIR PATH_TO_BROWSER_APP(optional)." && exit 1

pathjs=${args[0]}
filejs=$(basename "${pathjs}")
patht=${args[1]}

(("${filejs#*.}"!="js")) && echo "no .js file" && exit 1

rm -rf "$patht"/*

browserify "$pathjs" -i plask > $patht/bundle.js

cat > $patht/index.html <<- _EOF_
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

((${#args[@]}==3)) && open -a "${args[2]}" "$patht"/index.html