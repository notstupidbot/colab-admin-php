
# **Setup requirements**

### **Install nginx**
```sudo port install nginx```

### **Install php74**

```sudo port install php74```


### **Install php74-fpm**

```sudo port install php74-fpm```





### **Install php-zmq**
After installing php74 make sure to rename ```php74``` to ```php``` or make symlink or switch using command ```port default```

Also make symlink on ```/opt/bin``` for another php related binary e.g :

``` phpize74, php-config74```

change without suffix or prefix ```74```


build php-zmq extensios using ```phpize```

change default php headers to valid php-headers this can be accomplished by refine symlink ```php-config74``` to ```php-config```

```cd <php_zmq_dir>```

```phpize```

```./configure --prefix=/opt/local```

```make && make install```

If ```./configure``` stuck you have to install another dependencies, which shown on std error

### Setup nginx with php-fpm
Edit ```/opt/local/etc/nginx/nginx.conf```


```
server {
        listen       80;
        server_name  localhost;
        root   /opt/local/var/www/www-dist; # site location on the computer
        index  index.php index.html index.htm;
    
        client_max_body_size 2000M;
    
        location / {
            index index.php;
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            

            try_files $uri =404;
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi.conf;
            
        }
    
    }
```

### Setup nginx cors enable

Edit ```/opt/local/etc/nginx/nginx.conf```

```
location / {
     if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        #
        # Om nom nom cookies
        #
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        #
        # Custom headers and headers various browsers *should* be OK with but aren't
        #
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
        #
        # Tell client that this pre-flight info is valid for 20 days
        #
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
     }
     if ($request_method = 'POST') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
     }
     if ($request_method = 'GET') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
     }
}
```
### Example finished ```nginx.conf```

```
user nobody staff;
worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;
        root   /opt/local/var/www/www-dist; # site location on the computer
        index  index.php index.html index.htm;
    
        client_max_body_size 2000M;

        

    
        location / {


            index index.php;
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '*';
                #
                # Om nom nom cookies
                #
                add_header 'Access-Control-Allow-Credentials' 'true';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
                #
                # Custom headers and headers various browsers *should* be OK with but aren't
                #
                add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
                #
                # Tell client that this pre-flight info is valid for 20 days
                #
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
                }
             if ($request_method = 'POST') {
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Allow-Credentials' 'true';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
                add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
             }
             if ($request_method = 'GET') {
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Allow-Credentials' 'true';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
                add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
             }
            try_files $uri =404;
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi.conf;
            
        }
    
    }

    # You can add  , other servers , by copying , 
    # the previous server definition , and pasting it ,
    # in this file , before the closing bracket .
}

```

### Install postgresql15

```sudo port install postgresql15```

### Install postgresql15-server

```sudo port install postgresql15-server```

# Setup database connection

## Database related setup
Change password for current user, and set database config in 

```<project_dir>/backend/application/confg/database.php```

### Restore database
```cd <project_dir>/backend```

```bash addon/restore-db.sh```

### Backup database
```cd <project_dir>/backend```

```bash addon/backup-db.sh```




# Running Application

### Starting nginx

```sudo port load nginx```

### Starting php74-fpm

```sudo port load php74-fpm```

### Starting postgresql15-server

```sudo port load postgresql15-server```


### Starting zmq push server

```cd <project_dir>/backend```

```php addon/push-server.php```


### Starting frontend gui nodejs development
```cd <project_dir>/frontend```

```npm run dev```
