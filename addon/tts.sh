#!/usr/bin/env bash

cd /content/tts-venv
source bin/activate
tts --text "$1" \
    --model_path "$3/checkpoint.pth" \
    --config_path "$3/config.json" \
    --speaker_idx wibowo \
    --out_path "$2"