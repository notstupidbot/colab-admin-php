#!/usr/bin/env bash

export PATH=/container/dist/sbin:/container/dist/bin:$PATH

tmp_file=$2
CONVERT_TTF_PY=/container/dist/www/html/addon/convert-ttf.py
PWD=`pwd`
cd /container/dist/tts-indonesia

/container/dist/www/html/application/bin/tts-job-server.php "$1" "$2" "$3" "$4" "$5"