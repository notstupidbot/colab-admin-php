#!/usr/bin/env bash
# hash=`date`$((1 + $RANDOM % 10))
# hash=`echo -n $hash|md5sum|awk '{print $1}'`
# tmp_file=/tmp/ttf-$hash
tmp_file=$2
CONVERT_TTF_PY=/var/www/html/addon/convert-ttf.py
PWD=`pwd`
cd /content/tts-venv
# source bin/activate

python3 $CONVERT_TTF_PY "$1" #>$tmp_file

# cd $PWD
# echo $OUTPUT
# cat $tmp_file
# echo $CONVERT_TTF_PY