#!/usr/bin/env bash

export PATH=/container/dist/sbin:/container/dist/bin:$PATH
WWW_DIR=/container/dist/www/html
OUTPATH=$WWW_DIR/public/tts-output

JOB_ID="$1"
SENTENCE_ID="$2"
TEXT="$3"
SPEAKER_ID="$4"
INDEX="$5"

OUTFILE="$OUTPATH/$JOB_ID.wav"

if [[ ! -z "$INDEX" ]]; then
  OUTFILE="$OUTPATH/$JOB_ID-$INDEX.wav"
fi

URL="http://kutukupret:5002/api/tts?text=$TEXT&speaker_id=$SPEAKER_ID&style_wav=&language_id="

curl "$URL" -o "$OUTFILE"
