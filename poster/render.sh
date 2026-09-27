#!/bin/sh
# Render preview.html to PNG with headless Edge and report overflowing text boxes.
# Crops are written for close inspection: shot-top.png, shot-mid.png, shot-bot.png
set -e
cd "$(dirname "$0")"
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
URL="file:///$(pwd -W)/preview.html"
"$EDGE" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=2245,3179 --screenshot="$(pwd -W)/shot.png" "$URL" 2>/dev/null
"$EDGE" --headless --disable-gpu --dump-dom "$URL" 2>/dev/null | grep -o 'OVERFLOW .*]' | sed 's/&quot;/"/g'
python - <<'EOF'
from PIL import Image
im = Image.open("shot.png")
w, h = im.size
for name, (a, b) in {"top": (0, 0.36), "mid": (0.34, 0.70), "bot": (0.66, 1.0)}.items():
    im.crop((0, int(a*h), w, int(b*h))).save(f"shot-{name}.png")
print("shot", im.size)
EOF
