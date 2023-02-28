#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

CWD=`pwd`
WWW_DIR=$SCRIPT_DIR/..
cd $WWW_DIR
# ls -l
php index.php recovery restore

cd $CWD