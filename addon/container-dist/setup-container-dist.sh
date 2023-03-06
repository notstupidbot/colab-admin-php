cd /content
file_id="15LUqVtuEXBo6h3e0Gm_upAqslQ-BMQtS"
wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=15LUqVtuEXBo6h3e0Gm_upAqslQ-BMQtS' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=15LUqVtuEXBo6h3e0Gm_upAqslQ-BMQtS" -O dist.7z && rm -rf /tmp/cookies.txt

mkdir -p /container/dist
mkdir -p /container/src
#libzip-dev libonig-dev
cd /container/dist

7z x /content/dist.7z

# Setting Envoronment
export PATH=/container/dist/bin:/container/dist/sbin:$PATH
echo "export PATH=/container/dist/bin:/container/dist/sbin:$PATH" >> /root/.bashrc
echo "export DIST_DIR=/container/dist" >> /root/.bashrc
echo "export WWW_DIR=/container/dist/www/html" >> /root/.bashrc
echo "export WWW_PUSH_DIR=/container/dist/www/html/push-server" >> /root/.bashrc
echo "export ETC_DIR=/container/dist/etc" >> /root/.bashrc
echo "export INITD_DIR=/container/dist/etc/init.d" >> /root/.bashrc
echo "export GDRIVE=/content/gdrive" >> /root/.bashrc
echo "export LD_LIBRARY_PATH=/container/dist/lib/x86_64-linux-gnu"
# Restore rclone config
cd /content
wget https://raw.githubusercontent.com/notstupidbot/colab-admin-php/main/addon/container-dist/config/rclone/rclone.conf
mkdir -p /root/.config/rclone
cp rclone.conf /root/.config/rclone/rclone.conf
 
#starting vsftpd
cp /container/dist/etc/vsftpd.conf /etc/
cp /container/dist/etc/ftpusers /etc/

# apt install passwd
echo "Update root password"
echo "root:sejati86"|sudo chpasswd
echo "Adding www-data to sudoer"
useradd -m -p sejati86 "www-data"

echo "www-data ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

#setup pgsql
echo "Setup pgsql"
echo "Adding user postgres"

useradd -m -p sejati86 postgres
sleep 1
cp -r /container/dist/etc/postgresql/10/pgsql /container/dist/etc/postgresql/10/main
chown -R postgres:postgres /container/dist/etc/postgresql/10/main
chown -R postgres:postgres /container/dist/pgsql_data/10/main

# mount gdrive
echo "Mounting gdrive"
mkdir -p /content/gdrive
rclone mount gdrive: /content/gdrive --daemon
#starting php-fpm
ln -ns /container/dist/lib/x86_64-linux-gnu/libonig.so.5 /lib/x86_64-linux-gnu/libonig.so.5
ln -ns /container/dist/lib/x86_64-linux-gnu/libzip.so.5 /lib/x86_64-linux-gnu/libzip.so.5
/container/dist/etc/init.d/php-fpm start

#echo "Starting pgsql"
/container/dist/etc/init.d/pgsql start
#start dev-server
chmod +x /container/dist/www/html/npm-run-dev.sh
/container/dist/etc/init.d/dev-server start
#start push server
chmod +x /container/dist/www/html/push-server/npx-nodemon.sh
/container/dist/etc/init.d/push-server start
# starting gotty
/container/dist/etc/init.d/gotty start
#starting ftp
/container/dist/etc/init.d/vsftpd start
#starting dropbear
/container/dist/etc/init.d/dropbear start
#starting nginx
/container/dist/etc/init.d/nginx start
#./pg_ctl -D /container/dist/pgsql_data/10/main -l logfile start


# LINK FILES FROM Google Drive
# apt install squashfuse
# 1OdU3_-aubYSXvL8wMF50IiL3oTQ6x02y
cd /container
echo "Downloading site-packages.squashfs"

wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=1OdU3_-aubYSXvL8wMF50IiL3oTQ6x02y' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=1OdU3_-aubYSXvL8wMF50IiL3oTQ6x02y" -O site-packages.squashfs && rm -rf /tmp/cookies.txt


echo "Mounting container/site-packages.squashfs"
mkdir -p /container/site-packages
squashfuse /container/site-packages.squashfs  /container/site-packages
echo "Running tts"
tts
