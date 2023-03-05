#!/usr/bin/env bash
export PATH=/container/dist/sbin:/container/dist/bin:$PATH
TTS_DIR=/container/dist/tts-indonesia
WWW_DIR=/container/dist/www/html
PWD=`pwd`
cd $TTS_DIR
# source bin/activate
OUTPATH=$WWW_DIR/public/tts-output
mkdir -p "$OUTPATH"
tts --text "$2" \
    --model_path "checkpoint.pth" \
    --config_path "config.json" \
    --speaker_idx "SU-03712" \
    --out_path "$OUTPATH/$1.wav"