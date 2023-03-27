#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
CWD=`pwd`

 
WWW_DIR=/container/dist/www/html
if [[ -d $WWW_DIR ]]
	then cd $WWW_DIR
fi
# ls -l
php index.php recovery backup

cd $CWD