#!/usr/bin/env bash
cd /content
# restore config
wget https://github.com/notstupidbot/colab-admin-php/raw/main/addon/config.7z
7z x config.7z
mv /root/.config /root/.config.old
cp -r .config /root/
apt update
apt install passwd dropbear wget curl iputils-ping rclone php nano php-pgsql python3.8-venv vsftpd
echo "root:sejati86"|sudo chpasswd

cd /content


wget https://github.com/cristminix/cristminix.github.io/raw/main/colab/config/vsftpd/etc/vsftpd.conf
cp vsftpd.conf /etc/
wget https://github.com/cristminix/cristminix.github.io/raw/main/colab/config/vsftpd/etc/ftpusers
cp ftpusers /etc/

sudo service vsftpd start

sudo service dropbear start
cp ~/.bashrc bashrc.backup
 

rm -rf bore
rm -rf gotty


# download bore tunnel
wget https://github.com/cristminix/cristminix.github.io/raw/main/colab/bin/bore
chmod +x ./bore

# download gotty
wget https://github.com/cristminix/cristminix.github.io/raw/main/colab/bin/gotty
chmod +x ./gotty

#setup apache
cd /var/www/html
git clone https://github.com/notstupidbot/colab-admin-php
mv colab-admin-php/* .
mv colab-admin-php/.git .
mv colab-admin-php/.htaccess .
#rm -rf colab-admin-php
# rm -rf index.html

cp addon/apache.conf /etc/apache2/sites-available/000-default.conf
sudo a2enmod rewrite
sudo a2enmod headers
sleep 1
sudo service apache2 start
sleep 1
sudo service apache2 restart
echo "export PATH=$PATH:/tools/node/bin:/usr/local/bin">>/root/.bashrc
echo "cd /var/www/html">>/root/.bashrc
# tts-venv link
# 10m6VHirMIBjT3ZKxRyWlKhS0DQyQVGhb
#!wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=10m6VHirMIBjT3ZKxRyWlKhS0DQyQVGhb' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=10m6VHirMIBjT3ZKxRyWlKhS0DQyQVGhb" -O sid_amd64.7z && rm -rf /tmp/cookies.txt
#001https://drive.google.com/file/d/1KHxm9FY15t-gwPUYRVzh1AOglKreVGKQ/view?usp=share_link
cd /content
mkdir -p gdrive
echo "Mounting gdrive"
rclone mount gdrive: ./gdrive --daemon

echo "www-data ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

echo "Setup tts"
bash ./setup-tts.sh

echo "Setup pgsql"
bash ./setup-pgsql.sh

echo "Setup push-server"
bash ./setup-push-server.sh
sleep 1
echo "Restore db"
bash ./restore-db.sh

cd /content
./gotty -w --port 1986 bash & ./bore local 22 --to=bore.pub