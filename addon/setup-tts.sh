#!/usr/bin/env bash

VENF7z=/content/gdrive/tts-venv-01.7z
while [ ! -f "$VENF7z" ]
do
   echo "Waiting until drive mounted";
   sleep 1;
done

# sleep 5
ls ./gdrive
mkdir -p ./tts-venv
cd ./tts-venv
# 7z x "$VENF7z"
# source ./bin/activate
# cp /content/gdrive/tts .
# cp /content/gdrive/tts-server .
pip3 install TTS
git clone https://github.com/Wikidepia/g2p-id
pip3 install -U g2p-id/

wget https://github.com/Wikidepia/indonesian-tts/releases/download/v1.2/checkpoint_1260000-inference.pth
wget https://github.com/Wikidepia/indonesian-tts/releases/download/v1.2/config.json
wget https://github.com/Wikidepia/indonesian-tts/releases/download/v1.2/speakers.pth

mv checkpoint_1260000-inference.pth checkpoint.pth
tts --model_path checkpoint.pth \
    --config_path config.json \
    --list_speaker_idxs
# chmod +x tts
# chmod +x tts-server
# ./tts