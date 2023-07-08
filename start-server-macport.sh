#!/bin/bash

sudo port load nginx
sudo port load php74-fpm
sudo port load postgresql15-server
sleep 5
cwd=`pwd`
cd backend
php addon/push-server.php&

cd ..
cd frontend

npm run dev
