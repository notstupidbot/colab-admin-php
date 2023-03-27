**WALKTROUGH**

***How To Keep Colab Running Longer***
- Open RdpConnection With Local Account
	- This program called ``RDPCheck.exe``
- Login With Your RDP
- Open Msedge, open ``colab.research.google.com`` select your Notebook
- Run Colab Notebook
- Wait and validate the captcha
- Run Python autoclick
```
# Open Command Prompt
cd \Python39\
python.exe colab_autoclick.py

# Create this Python3 file
# colab_autoclick.py

import numpy as np
import time
import mouse

while True:
	random_row = np.random.random_sample()*100
	random_col = np.random.random_sample()*10
	random_time = np.random.random_sample()*np.random.random_sample() * 100
	mouse.wheel(1000)
	mouse.wheel(-1000)
	mouse.move(random_row, random_col, absolute=False, duration=0.2)
	mouse.move(-random_row, -random_col, absolute=False, duration = 0.2)
	mouse.LEFT
	time.sleep(random_time)
```

**Consider Run Dropbear SSH Server And run it localy with Sock5 Proxy Tunnel**

```
# Shell scripts
apt install dropbear passwd
# set root password
echo "root:YOUR_PASSWORD"|sudo chpasswd
# install bore tunnel
# download bore tunnel
cd /content
wget https://github.com/cristminix/cristminix.github.io/raw/main/colab/bin/bore
chmod +x ./bore
# starting bore with ssh port
./bore local 22 --to=bore.pub
```

***Setup Local SockProxy Tunnel With Bvssh***
- Run program called `bvssh`
- Set setting in login tab with host `bore.pub`
- Set setting port got from running bore command instance
```
Example colab cell output
!./bore local 22 --to=bore.pub

2023-03-03T01:04:22.660461Z  INFO bore_cli::client: connected to server remote_port=43767
2023-03-03T01:04:22.660505Z  INFO bore_cli::client: listening at bore.pub:43767
20
```
- Then you got `43767` set it
- Go to service tab and enable Sock Proxy set to ip `127.0.0.1` and port wathever `1080` or `1081`

***Run and test container service with Proxifier***
- Get program called `proxifier`
- Setup required and run the program to connect via sock proxy you have been set before

**Now You can run container as localhost**
- You can run nginx, ftp, whatever