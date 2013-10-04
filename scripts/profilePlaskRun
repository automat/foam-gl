#!/bin/bash

. paths

((!$#)) && echo "PATH_TO_APP_JS missing." && exit 1

filejs=$(basename "$1")
dirjs=$(dirname "$1")

if [ "${filejs#*.}" != "js" ]
then
	echo "no .js file!"
	exit 1
else
	${PLASK} --prof "$1"
	wait
	echo "plask prof done"

	env D8_PATH="${PATH_D8}" "${TICK_PROCESSOR}" v8.log > "${dirjs}"/v8_processed.txt
	rm v8.log
	echo "prof process done"
fi