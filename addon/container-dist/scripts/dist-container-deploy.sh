#!/usr/bin/env bash
CWD=`pwd`
cd /container/dist
echo "Creating /container/dist.7z"
7z a -r -mx=0 -mmt=off ../dist.7z .
echo "Copyng /container/dist.7z to /content/gdrive/"
cp ../dist.7z /content/gdrive/
echo "Backup saved to /content/gdrive/dist.7z"
cd $CWD