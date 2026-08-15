#!/usr/bin/env node
// Generates the 16 "square split into 4 triangles" background images used to
// show which of a piece's 4 ports (Up, Right, Down, Left) are currently on,
// independent of the piece's own black-line outline. Each of the 16 possible
// on/off combinations gets its own PNG, named by which directions are on
// (e.g. "up-right.png"), with "off.png" for the all-off case.
//
// Usage:
//   node scripts/generate-port-colours.mjs [--on <colour>] [--off <colour>] [--out <dir>] [--size <px>]
//
// Colours are anything an SVG `fill` accepts (hex, named colours, "transparent", rgba(...)).
// Requires `rsvg-convert` on PATH to rasterize the generated SVG to PNG.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DIRECTIONS = ['up', 'right', 'down', 'left'];

function parseArgs(argv) {
  const args = { on: '#0000ff', off: 'transparent', out: 'dist/static/images/port_colours', size: 225 };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === '--on') { args.on = value; i++; }
    else if (flag === '--off') { args.off = value; i++; }
    else if (flag === '--out') { args.out = value; i++; }
    else if (flag === '--size') { args.size = Number(value); i++; }
    else if (flag === '--help' || flag === '-h') { args.help = true; }
    else { throw new Error(`Unknown argument: ${flag}`); }
  }
  return args;
}

// The four triangles a square makes when cut along both diagonals, one per
// cardinal direction, matching Game.Direction's Up/Right/Down/Left order.
function trianglePoints(direction, size) {
  const c = size / 2;
  switch (direction) {
    case 'up': return [[0, 0], [size, 0], [c, c]];
    case 'right': return [[size, 0], [size, size], [c, c]];
    case 'down': return [[size, size], [0, size], [c, c]];
    case 'left': return [[0, size], [0, 0], [c, c]];
    default: throw new Error(`Unknown direction: ${direction}`);
  }
}

// Scaled out a hair from its own centroid, so adjacent triangles overlap
// slightly at the shared center point instead of just touching -- without
// this, same-coloured neighbours (e.g. all four "on") show a faint
// antialiasing hairline along the diagonal where two edges merely abut.
function overscale(points, factor) {
  const cx = points.reduce((sum, [x]) => sum + x, 0) / points.length;
  const cy = points.reduce((sum, [, y]) => sum + y, 0) / points.length;
  return points.map(([x, y]) => [cx + (x - cx) * factor, cy + (y - cy) * factor]);
}

function svgFor(onDirections, onColour, offColour, size) {
  const polygons = DIRECTIONS.map(dir => {
    const fill = onDirections.includes(dir) ? onColour : offColour;
    const points = overscale(trianglePoints(dir, size), 1.02).map(([x, y]) => `${x},${y}`).join(' ');
    return `  <polygon points="${points}" fill="${fill}" />`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">\n${polygons}\n</svg>\n`;
}

// Every subset of DIRECTIONS, smallest (none on) first -- 16 combinations total.
function allCombinations() {
  const combos = [];
  for (let mask = 0; mask < 16; mask++) {
    combos.push(DIRECTIONS.filter((_, i) => (mask & (1 << i)) !== 0));
  }
  return combos;
}

function nameFor(onDirections) {
  return onDirections.length === 0 ? 'off' : onDirections.join('-');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('Usage: node scripts/generate-port-colours.mjs [--on <colour>] [--off <colour>] [--out <dir>] [--size <px>]');
    return;
  }

  mkdirSync(args.out, { recursive: true });
  const workDir = mkdtempSync(join(tmpdir(), 'port-colours-'));

  try {
    for (const onDirections of allCombinations()) {
      const name = nameFor(onDirections);
      const svgPath = join(workDir, `${name}.svg`);
      const pngPath = join(args.out, `${name}.png`);

      writeFileSync(svgPath, svgFor(onDirections, args.on, args.off, args.size));
      execFileSync('rsvg-convert', ['-w', String(args.size), '-h', String(args.size), '-o', pngPath, svgPath]);
      console.log(`wrote ${pngPath}`);
    }
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

main();
