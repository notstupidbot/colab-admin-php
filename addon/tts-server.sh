#!/usr/bin/env bash
export PATH=/container/dist/sbin:/container/dist/bin:$PATH
TTS_DIR=/container/dist/tts-indonesia
PWD=`pwd`
cd $TTS_DIR

tts-server --model_path "checkpoint.pth" \
    --config_path "config.json" 