cd /content
file_id="15LUqVtuEXBo6h3e0Gm_upAqslQ-BMQtS"
wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=$file_id' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=file_id" -O dist.7z && rm -rf /tmp/cookies.txt

mkdir -p /container/dist
mkdir -p /container/src

cd /container/dist

7z x /content/dist.7z

# Setting Envoronment
export PATH=/container/dist/bin:/container/dist/sbin:$PATH
echo "export PATH=/container/dist/bin:/container/dist/sbin:$PATH" >> /root/.bashrc

# Restore rclone config
cd /content
wget https://github.com/notstupidbot/colab-admin-php/raw/main/addon/config.7z
7z x config.7z
mv /root/.config /root/.config.old
cp -r .config /root/
 
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
cp -r /container/dist/etc/postgresql/10/pgsql /container/dist/etc/postgresql/10/main
chown -R postgres:postgres /container/dist/etc/postgresql/10/main


# mount gdrive
echo "Mounting gdrive"
mkdir -p /content/gdrive
rclone mount gdrive: /content/gdrive --daemon
#echo "Starting pgsql"
/container/etc/init.d/pgsql start
#start dev-server
/container/etc/init.d/dev-server start
#start push server
/container/etc/init.d/push-server start
# starting gotty
/container/dist/etc/init.d/gotty start
#starting ftp
/container/dist/etc/init.d/vsftpd start
#starting dropbear
/container/dist/etc/init.d/dropbear start
#./pg_ctl -D /container/dist/pgsql_data/10/main -l logfile start