#!/usr/bin/env bash
# Records a short screen demo: drag-select a region with slop, highlight the
# cursor with highlight-pointer while ffmpeg captures, save an mp4 next to
# the existing demonstration videos.
#
# highlight-pointer (not gromit-mpx) on purpose: gromit-mpx grabs clicks to
# draw with them instead of passing them to whatever's underneath, so it
# can't annotate a *live* drag -- the click either draws or reaches the
# browser, never both. highlight-pointer just decorates the real cursor and
# never intercepts input, so an actual drag still reaches the browser.
#
# Requires: yay -S highlight-pointer  (not installed by this script)
#
# Usage: scripts/record-demo.sh [duration-in-seconds]   (default: 5)
set -euo pipefail

duration="${1:-5}"
outdir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/dist/static/images/demonstrations"
mkdir -p "$outdir"
outfile="$outdir/demo-$(date +%Y%m%d-%H%M%S).mp4"

echo "Drag to select the region to record (Esc to cancel)..."
geom=$(slop --noopengl -f "%g") || { echo "Selection cancelled." >&2; exit 1; }

# slop's default format is WxH+X+Y, e.g. "800x600+100+50"
raw_size="${geom%%+*}"
rest="${geom#*+}"
x="${rest%%+*}"
y="${rest#*+}"

# libx264 needs even width/height (4:2:0 chroma subsampling) -- a freehand
# drag selection can easily land on an odd pixel count, so round both down.
w="${raw_size%%x*}"
h="${raw_size#*x}"
w=$(( w - w % 2 ))
h=$(( h - h % 2 ))
size="${w}x${h}"

echo "Recording ${size} at +${x},${y} for ${duration}s -> ${outfile}"

highlight-pointer &
highlight_pid=$!
sleep 0.5 # give it a moment to attach before recording starts

ffmpeg -y -f x11grab -framerate 30 -video_size "$size" -i ":0.0+${x},${y}" \
  -t "$duration" -vcodec libx264 -preset ultrafast -crf 23 -pix_fmt yuv420p \
  "$outfile"

kill "$highlight_pid" 2>/dev/null || true

echo "Saved: $outfile"
