#!/usr/bin/env bash
export PATH=/container/dist/sbin:/container/dist/bin:$PATH
TTS_DIR=/container/dist/tts-indonesia
WWW_DIR=/container/dist/www/html
PWD=`pwd`
cd $TTS_DIR
# source bin/activate
OUTPATH=$WWW_DIR/public/tts-output
OUTFILE="$OUTPATH/$1.wav"
if [ ! -z "$3" ]
then
  OUTFILE="$OUTPATH/$1-$3.wav"
fi
mkdir -p "$OUTPATH"
tts --text "$2" \
    --model_path "checkpoint.pth" \
    --config_path "config.json" \
    --speaker_idx "SU-03712" \
    --out_path $OUTFILE