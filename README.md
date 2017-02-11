# Chip8 Emulator

A chip8 emulator written in TypeScript.

Code is very approachable for learning but optimizes well.

GC does not pause because the heap is simple, largely only used by postMessage. Even a Major GC is < 0.1 ms.

VM runs in a Web Worker, uses an Oscillator and screen is scaled on the GPU so it only has to draw the Chip8 native 64 x 32.

TODO:
buffer changes in pixels to eliminate XOR flicker
