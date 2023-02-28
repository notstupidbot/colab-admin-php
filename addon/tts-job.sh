#!/usr/bin/env bash

cd /content/tts-venv
# source bin/activate
OUTPATH=/var/www/html/public/tts-output
mkdir -p "$OUTPATH"
tts --text "$2" \
    --model_path "checkpoint.pth" \
    --config_path "config.json" \
    --speaker_idx wibowo \
    --out_path "$OUTPATH/$1.wav"