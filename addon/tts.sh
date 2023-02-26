#!/usr/bin/env bash

cd /content/tts-venv
source bin/activate
tts --text "$1" \
    --model_path checkpoint.pth \
    --config_path config.json \
    --speaker_idx wibowo \
    --out_path "$2"