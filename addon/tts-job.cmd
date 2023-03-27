@echo off
set CWD=%~dp0 
rem echo %2

set OUTPATH=C:\nginx\colab-admin-php\www-dist\public\tts-output
set TTS_DIR=C:\python39\indonesia-tts
cd %TTS_DIR%
tts --text %2 --model_path "checkpoint.pth" --config_path "config.json" --speaker_idx wibowo  --out_path "%OUTPATH%\%1.wav"
cd %CWD%