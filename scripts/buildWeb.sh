#!/bin/sh

# buildWeb - Browersify app.js, put bundle.js / index.html in clean temp folder,
#            open in browser,

((!$#)) && echo PATH_TO_APP_JS PATH_TO_TEM_DIR missing && exit 1

# BIN=/usr/local/bin

rm $2/*

browserify $1 -i plask > $2/bundle.js

cat > $2/index.html <<- _EOF_
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

open -a "Google Chrome.app" $2/index.html





