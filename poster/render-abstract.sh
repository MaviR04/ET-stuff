#!/bin/sh
# Render the graphical abstract to a 300 dpi PNG (21.586 x 2.75 in) with headless Edge,
# and report any overflowing text boxes.
set -e
cd "$(dirname "$0")"
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
URL="file:///$(pwd -W)/abstract-preview.html"
# 96 css px per inch x 3.125 = 300 dpi
"$EDGE" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=3.125 \
  --window-size=2073,264 --screenshot="$(pwd -W)/graphical-abstract.png" "$URL" 2>/dev/null
"$EDGE" --headless --disable-gpu --dump-dom "$URL" 2>/dev/null | grep -o 'OVERFLOW .*]' | sed 's/&quot;/"/g'
python -c "from PIL import Image; im=Image.open('graphical-abstract.png'); print('png', im.size)"
