#!/bin/bash
# macOS menu bar tray icons — 32pt @2x (64px)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OUT=64
POINT=32
WORK=$((OUT * 4))
ICON=$((OUT * 122 / 44))
BADGE=$((OUT * 38 / 44 + 16))
BADGE_X=6
BADGE_Y=10

build_hd_badge() {
  local size=$1
  local ss=$((size * 4))
  local c=$((ss / 2))
  local stroke=$((ss * 10 / 320))

  magick -size "${ss}x${ss}" xc:none \
    -fill radial-gradient:"#88EE98-#22A844" \
    -draw "circle ${c},${c} ${c},12" \
    \( -size "${ss}x${ss}" xc:none -fill "rgba(255,255,255,0.25)" \
       -draw "circle $((c - 8)),$((c - 14)) $((c - 28)),$((c - 36))" \) \
    -compose Over -composite \
    -fill none -stroke "rgba(0,0,0,0.18)" -strokewidth 2.5 \
    -draw "circle ${c},${c} $((c - 1)),12" \
    -fill none -stroke white -strokewidth "${stroke}" \
    -draw "path 'M $((c - 46)),${c} L $((c - 14)),$((c + 30)) L $((c + 54)),$((c - 38))'" \
    -filter Lanczos -resize "${size}x${size}" \
    /tmp/robo-badge.png
}

magick -size "${ICON}x${ICON}" xc:none \
  \( icon.png -resize "$((ICON - 2))x$((ICON - 2))" -filter Lanczos \) -gravity center -composite \
  /tmp/robo-tray-logo.png

magick -size "${WORK}x${WORK}" xc:none \
  \( /tmp/robo-tray-logo.png -gravity center \) -composite \
  -filter Lanczos -resize "${OUT}x${OUT}" \
  tray-icon-idle.png

build_hd_badge "${BADGE}"

magick -size "${ICON}x${ICON}" xc:none \
  \( /tmp/robo-tray-logo.png \) -composite \
  \( /tmp/robo-badge.png \) -gravity southeast -geometry +${BADGE_X}+${BADGE_Y} -composite \
  /tmp/robo-tray-active-logo.png

magick -size "${WORK}x${WORK}" xc:none \
  \( /tmp/robo-tray-active-logo.png -gravity center \) -composite \
  -filter Lanczos -resize "${OUT}x${OUT}" \
  tray-icon-active.png

echo "Generated tray icons (${OUT}x${OUT}px, ${POINT}pt @2x)"
