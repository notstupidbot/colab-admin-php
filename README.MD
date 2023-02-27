***Colab Admin PHP***

**CLI List**

Server related setup
```
$ addon/setup-minimal-server.sh   # run setup install required software on ubuntu 20.04
$ addon/setup-tts.sh # install coqui-tts python3.8 module, and indonesia tts support
$ addon/setup-pgsql # install & setup postgres
```

Database related cli
```
$ addon/restore-db.sh   # restore db and load json dumps
$ addon/backup-db.sh    # backup db and save to json dumps
$ addon/fixtures-db.sh  # load fixtures db sample rows

```

**API List**

Get tts-project list

```
[GET]/api/tts/project
```
Get tts-project detail

```
[GET]/api/tts/project?id=0eb81f8c52f3f50e5c7fdcd50e124d33
```
Create tts-project

```
[POST]/api/tts/project
params , type FormData post

text="akan selalu ada yang bisa membuatku tertawa dan sedih atau 
bahagia"

```
