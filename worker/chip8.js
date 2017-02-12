(function () {
'use strict';

var FONT = new Uint8Array([
    0xF0, 0x90, 0x90, 0x90, 0xF0,
    0x20, 0x60, 0x20, 0x20, 0x70,
    0xF0, 0x10, 0xF0, 0x80, 0xF0,
    0xF0, 0x10, 0xF0, 0x10, 0xF0,
    0x90, 0x90, 0xF0, 0x10, 0x10,
    0xF0, 0x80, 0xF0, 0x10, 0xF0,
    0xF0, 0x80, 0xF0, 0x90, 0xF0,
    0xF0, 0x10, 0x20, 0x40, 0x40,
    0xF0, 0x90, 0xF0, 0x90, 0xF0,
    0xF0, 0x90, 0xF0, 0x10, 0xF0,
    0xF0, 0x90, 0xF0, 0x90, 0x90,
    0xE0, 0x90, 0xE0, 0x90, 0xE0,
    0xF0, 0x80, 0x80, 0x80, 0xF0,
    0xE0, 0x90, 0x90, 0x90, 0xE0,
    0xF0, 0x80, 0xF0, 0x80, 0xF0,
    0xF0, 0x80, 0xF0, 0x80, 0x80 ]);

var Opcode = function Opcode() {
    this.raw = 0;
};

var prototypeAccessors = { addr: {},byte: {},hi: {},lo: {},x: {},y: {} };
prototypeAccessors.addr.get = function () {
    return (this.raw & 0x0FFF);
};
prototypeAccessors.byte.get = function () {
    return (this.raw & 0x00FF);
};
prototypeAccessors.hi.get = function () {
    return (this.raw & 0xF000) >> 12;
};
prototypeAccessors.lo.get = function () {
    return (this.raw & 0x000F);
};
prototypeAccessors.x.get = function () {
    return (this.raw & 0x0F00) >> 8;
};
prototypeAccessors.y.get = function () {
    return (this.raw & 0x00F0) >> 4;
};

Object.defineProperties( Opcode.prototype, prototypeAccessors );
var ProgramCounter = function ProgramCounter(RAM) {
    this.RAM = RAM;
    this.pc = 512 /* PROGRAM_START */;
    this.sp = 0;
    this.stack = new Uint16Array(16 /* STACK_SIZE */);
    this.opcode = new Opcode();
};
ProgramCounter.prototype.jump = function jump (addr) {
    this.pc = addr;
};
ProgramCounter.prototype.push = function push () {
    this.stack[this.sp++] = this.pc;
};
ProgramCounter.prototype.pop = function pop () {
    this.pc = this.stack[--this.sp];
};
ProgramCounter.prototype.skip = function skip () {
    this.pc += 2;
};
ProgramCounter.prototype.next = function next () {
    var hi = this.RAM[this.pc] << 8;
    var lo = this.RAM[this.pc + 1];
    this.opcode.raw = hi | lo;
    this.pc += 2;
    return this.opcode;
};
function createProgramCounter(RAM) {
    return new ProgramCounter(RAM);
}

function createOperations(vm) {
    var RAM = vm.RAM;
    var pixels = vm.pixels;
    var keys = vm.keys;
    var programCounter = createProgramCounter(RAM);
    var V = new Uint8Array(16 /* REGISTER_SIZE */);
    var I = 0;
    var Op = [];
    var Op0x0 = {};
    var Op0x8 = {};
    var Op0xE = {};
    var Op0xF = {};
    // Dispatch to 0xxx Ops
    Op[0x0] = function (opcode) {
        Op0x0[opcode.byte](opcode);
    };
    // 00E0 - CLS
    Op0x0[0xE0] = function CLR() {
        pixels.fill(0);
        vm.draw();
    };
    // 00EE - RET
    Op0x0[0xEE] = function RET() {
        programCounter.pop();
    };
    // 1nnn - JP addr
    Op[0x1] = function JP_addr(ref) {
        var addr = ref.addr;

        programCounter.jump(addr);
    };
    // 2nnn - CALL addr
    Op[0x2] = function CALL_addr(ref) {
        var addr = ref.addr;

        programCounter.push();
        programCounter.jump(addr);
    };
    // 3xkk - SE Vx, byte
    Op[0x3] = function SE_Vx_byte(ref) {
        var x = ref.x;
        var byte = ref.byte;

        if (V[x] === byte)
            { programCounter.skip(); }
    };
    // 4xkk - SNE Vx, byte
    Op[0x4] = function SNE_Vx_byte(ref) {
        var x = ref.x;
        var byte = ref.byte;

        if (V[x] !== byte)
            { programCounter.skip(); }
    };
    // 5xy0 - SE Vx, Vy
    Op[0x5] = function SE_Vx_Vy(ref) {
        var x = ref.x;
        var y = ref.y;

        if (V[x] === V[y])
            { programCounter.skip(); }
    };
    // 6xkk - LD Vx, byte
    Op[0x6] = function LD_Vx_byte(ref) {
        var x = ref.x;
        var byte = ref.byte;

        V[x] = byte;
    };
    // 7xkk - ADD Vx, byte
    Op[0x7] = function ADD_Vx_byte(ref) {
        var x = ref.x;
        var byte = ref.byte;

        V[x] += byte;
    };
    // Dispatch to 8xxn Ops
    Op[0x8] = function (opcode) {
        Op0x8[opcode.lo](opcode);
    };
    // 8xy0 - LD Vx, Vy
    Op0x8[0x0] = function LD_Vx_Vy(ref) {
        var x = ref.x;
        var y = ref.y;

        V[x] = V[y];
    };
    // 8xy1 - OR Vx, Vy
    Op0x8[0x1] = function OR_Vx_Vy(ref) {
        var x = ref.x;
        var y = ref.y;

        V[x] |= V[y];
    };
    // 8xy2 - AND Vx, Vy
    Op0x8[0x2] = function AND_Vx_Vy(ref) {
        var x = ref.x;
        var y = ref.y;

        V[x] &= V[y];
    };
    // 8xy3 - XOR Vx, Vy
    Op0x8[0x3] = function XOR_Vx_Vy(ref) {
        var x = ref.x;
        var y = ref.y;

        V[x] ^= V[y];
    };
    // 8xy4 - ADD Vx, Vy
    Op0x8[0x4] = function ADD_Vx_Vy(ref) {
        var x = ref.x;
        var y = ref.y;

        var res = V[x] + V[y];
        V[0xF] = res > 0xFF ? 1 : 0;
        V[x] = res;
    };
    // 8xy5 - SUB Vx, Vy
    Op0x8[0x5] = function SUB_Vx_Vy(ref) {
        var x = ref.x;
        var y = ref.y;

        var Vx = V[x];
        var Vy = V[y];
        // If Vx > Vy, then VF is set to 1, otherwise 0.
        V[0xF] = Vx > Vy ? 1 : 0;
        V[x] = Vx - Vy;
    };
    // 8xy6 - SHR Vx {, Vy}
    Op0x8[0x6] = function SHR_Vx(ref) {
        var x = ref.x;

        var Vx = V[x];
        V[0xF] = 0x1 & Vx;
        V[x] = Vx >> 1;
    };
    // 8xy7 - SUBN Vx, Vy
    Op0x8[0x7] = function SUBN_Vx_Vy(ref) {
        var x = ref.x;
        var y = ref.y;

        var Vx = V[x];
        var Vy = V[y];
        // If Vy > Vx, then VF is set to 1, otherwise 0.
        V[0xF] = Vy > Vx ? 1 : 0;
        V[x] = Vy - Vx; // will wrap when Uint8Array set
    };
    // 8xyE - SHL Vx {, Vy}
    Op0x8[0xE] = function SHL_Vx_Vy(ref) {
        var x = ref.x;

        var Vx = V[x];
        V[0xF] = Vx >> 7;
        V[x] = Vx << 1;
    };
    // 9xy0 - SNE Vx, Vy
    Op[0x9] = function SNE_Vx_Vy(ref) {
        var x = ref.x;
        var y = ref.y;

        if (V[x] !== V[y])
            { programCounter.skip(); }
    };
    // Annn - LD I, addr
    Op[0xA] = function LD_I_addr(ref) {
        var addr = ref.addr;

        I = addr;
    };
    // Bnnn - JP V0, addr
    Op[0xB] = function JP_V0_addr(ref) {
        var addr = ref.addr;

        programCounter.jump(V[0] + addr);
    };
    // Cxkk - RND Vx, byte
    Op[0xC] = function RND_Vx_byte(ref) {
        var x = ref.x;
        var byte = ref.byte;

        V[x] = (Math.random() * 0x100) & byte;
    };
    // Dxyn - DRW Vx, Vy, nibble
    Op[0xD] = function DRW_Vx_Vy_n(ref) {
        var x = ref.x;
        var y = ref.y;
        var n = ref.lo;

        var Vx = V[x];
        var Vy = V[y];
        V[0xF] = 0;
        for (var sy = 0; sy < n; sy++) {
            var dy = (Vy + sy) % 32;
            var yline = RAM[I + sy];
            for (var sx = 0; sx < 8; sx++) {
                // loop over the bits of the byte
                var px = (yline >> (7 - sx)) & 1;
                var dx = (Vx + sx) % 64;
                var idx = dy * 64 /* SCREEN_WIDTH */ + dx;
                pixels[idx] ^= px;
                V[0xF] |= pixels[idx] == 0 && px == 1 ? 1 : 0;
            }
        }
        vm.draw();
    };
    // Dispatch to 9xxx Ops
    Op[0xE] = function (opcode) {
        Op0xE[opcode.byte](opcode);
    };
    // Ex9E - SKP Vx
    Op0xE[0x9E] = function SKP_Vx(opcode) {
        var x = opcode.x;
        if (keys[V[x]] === 1)
            { programCounter.skip(); }
    };
    // ExA1 - SKNP Vx
    Op0xE[0xA1] = function SKNP_Vx(opcode) {
        var x = opcode.x;
        if (keys[V[x]] !== 1)
            { programCounter.skip(); }
    };
    // Dispatch to Fxxx Ops
    Op[0xF] = function (opcode) {
        Op0xF[opcode.byte](opcode);
    };
    // Fx07 - LD Vx, DT
    Op0xF[0x07] = function LD_Vx_DT(opcode) {
        var x = opcode.x;
        V[x] = vm.delayTimer;
    };
    // Fx0A - LD Vx, K
    Op0xF[0x0A] = function LD_Vx_K(opcode) {
        var x = opcode.x;
        vm.waitForKey(function (key) { return V[x] = key; });
    };
    // Fx15 - LD DT, Vx
    Op0xF[0x15] = function LD_DT_Vx(ref) {
        var x = ref.x;

        vm.delayTimer = V[x];
    };
    // Fx18 - LD ST, Vx
    Op0xF[0x18] = function LD_ST_Vx(ref) {
        var x = ref.x;

        vm.soundTimer = V[x];
    };
    // Fx1E - ADD I, Vx
    Op0xF[0x1E] = function ADD_I_Vx(ref) {
        var x = ref.x;

        I += V[x];
    };
    // Fx29 - LD F, Vx
    Op0xF[0x29] = function LD_F_Vx(ref) {
        var x = ref.x;

        I = V[x] * 5 /* FONT_WIDTH */;
    };
    // Fx33 - LD BCD, Vx
    Op0xF[0x33] = function LD_BCD_Vx(ref) {
        var x = ref.x;

        var Vx = V[x];
        var bcd = (Vx / 100) | 0;
        RAM[I] = bcd;
        Vx -= bcd * 100;
        bcd = (Vx / 10) | 0;
        RAM[I + 1] = bcd;
        Vx -= bcd * 10;
        RAM[I + 2] = Vx;
    };
    // Fx55 - LD [I], Vx
    Op0xF[0x55] = function LD_I_Vx(ref) {
        var x = ref.x;

        for (var i = 0; i <= x; i++) {
            RAM[I + i] = V[i];
        }
    };
    // Fx65 - LD Vx, [I]
    Op0xF[0x65] = function LD_Vx_I(ref) {
        var x = ref.x;

        for (var i = 0; i <= x; i++) {
            V[i] = RAM[I + i];
        }
    };
    return {
        execOp: function execOp() {
            var opcode = programCounter.next();
            Op[opcode.hi](opcode);
        }
    };
}

function createVirtualMachine(delegate) {
    var RAM = new Uint8Array(4096 /* RAM_SIZE */);
    var pixels = new Uint8Array(2048 /* SCREEN_SIZE */);
    var keys = new Uint8Array(16 /* KEY_SIZE */);
    var vm = {
        RAM: RAM,
        pixels: pixels,
        keys: keys,
        draw: function draw() {
            delegate.draw(pixels);
        },
        soundTimer: 0,
        delayTimer: 0,
        waitForKey: function waitForKey(cb) {
            waitForKeyCallback = cb;
            pause();
        }
    };
    var waitForKeyCallback;
    var interval;
    var operations;
    var lastTick;
    var cycleCount;
    var idealCount;
    var soundOn = false;
    var paused = false;
    var start = Date.now();
    function flush() {
        while (!paused) {
            var elapsed = Date.now() - start;
            // 600hz
            var idealCycles = (elapsed * 600 / 1000) | 0;
            if (cycleCount >= idealCycles) {
                break;
            }
            for (; cycleCount < idealCycles; cycleCount++) {
                operations.execOp();
                if (paused)
                    { return; }
                // decrement at 60hz
                if (cycleCount % 10 === 0) {
                    if (vm.delayTimer > 0) {
                        vm.delayTimer--;
                    }
                    if (vm.soundTimer > 0) {
                        vm.soundTimer--;
                    }
                }
                if (vm.soundTimer > 0) {
                    if (!soundOn) {
                        soundOn = true;
                        delegate.startTone();
                    }
                }
                else {
                    if (soundOn) {
                        soundOn = false;
                        delegate.stopTone();
                    }
                }
            }
        }
    }
    function pause() {
        clearInterval(interval);
        delegate.stopTone();
        soundOn = false;
        paused = true;
    }
    function resume() {
        start = Date.now();
        cycleCount = 0;
        interval = setInterval(flush, 16);
        paused = false;
    }
    return {
        loadROM: function loadROM(ROM) {
            pause();
            RAM.set(FONT);
            RAM.fill(0, FONT.length, 512 /* PROGRAM_START */);
            RAM.set(ROM, 512 /* PROGRAM_START */);
            RAM.fill(0, 512 /* PROGRAM_START */ + ROM.length);
            pixels.fill(0);
            operations = createOperations(vm);
            resume();
        },
        keyUp: function keyUp(key) {
            keys[key] = 0;
            flush();
        },
        keyDown: function keyDown(key) {
            if (waitForKeyCallback) {
                waitForKeyCallback(key);
                waitForKeyCallback = undefined;
                resume();
            }
            keys[key] = 1;
            flush();
        }
    };
}

var vm = createVirtualMachine({
    draw: function draw(pixels) {
        postMessage({
            cmd: "draw",
            pixels: pixels
        });
    },
    startTone: function startTone() {
        postMessage({
            cmd: "startTone"
        });
    },
    stopTone: function stopTone() {
        postMessage({
            cmd: "stopTone"
        });
    }
});
function readROMFile(file) {
    var reader = new FileReaderSync();
    var buffer = reader.readAsArrayBuffer(file);
    vm.loadROM(new Uint8Array(buffer));
}
onmessage = function (msg) {
    switch (msg.data.cmd) {
        case "load":
            readROMFile(msg.data.rom);
            break;
        case "keydown":
            vm.keyDown(msg.data.key);
            break;
        case "keyup":
            vm.keyUp(msg.data.key);
            break;
    }
};

}());

//# sourceMappingURL=chip8.js.map
