#!/usr/bin/env bash

cd /content/tts-venv
# source bin/activate
# OUTPATH=/content/tts-output
mkdir -p "$OUTPATH"
tts --text "$1" \
    --model_path "$3/checkpoint.pth" \
    --config_path "$3/config.json" \
    --speaker_idx wibowo \
    --out_path "$OUTPATH/$2"