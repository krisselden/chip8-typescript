import { SIZE } from "./constants";
import { IOpCode, IProgramCounter } from "./interface";
import createProgramCounter from "./program_counter";

export interface VirtualMachine {
  RAM: Uint8Array;

  pixels: Uint8Array;
  draw(): void;

  soundTimer: number;
  delayTimer: number;

  keys: Uint8Array;
  waitForKey(callback: (key: number) => void): void;
}

export interface Operations {
  execOp(): void;
}

export default function createOperations(vm: VirtualMachine): Operations {
  interface OpTable {
    [index: number]: (opcode: IOpCode) => void;
  }

  const { RAM, pixels, keys } = vm;

  const programCounter = createProgramCounter(RAM);
  const V = new Uint8Array(SIZE.REGISTER_SIZE);

  let I = 0;

  const Op: OpTable = [];
  const Op0x0: OpTable = {};
  const Op0x8: OpTable = {};
  const Op0xE: OpTable = {};
  const Op0xF: OpTable = {};

  // Dispatch to 0xxx Ops
  Op[0x0] = function (opcode) {
    Op0x0[opcode.byte](opcode);
  }

  // 00E0 - CLS
  Op0x0[0xE0] = function CLR() {
    pixels.fill(0);
    vm.draw();
  }

  // 00EE - RET
  Op0x0[0xEE] = function RET() {
    programCounter.pop();
  }

  // 1nnn - JP addr
  Op[0x1] = function JP_addr({ addr }) {
    programCounter.jump(addr);
  }

  // 2nnn - CALL addr
  Op[0x2] = function CALL_addr({ addr }) {
    programCounter.push();
    programCounter.jump(addr);
  }

  // 3xkk - SE Vx, byte
  Op[0x3] = function SE_Vx_byte({ x, byte }) {
    if (V[x] === byte) programCounter.skip();
  }

  // 4xkk - SNE Vx, byte
  Op[0x4] = function SNE_Vx_byte({ x, byte }) {
    if (V[x] !== byte) programCounter.skip();
  }

  // 5xy0 - SE Vx, Vy
  Op[0x5] = function SE_Vx_Vy({ x, y }) {
    if (V[x] === V[y]) programCounter.skip();
  }

  // 6xkk - LD Vx, byte
  Op[0x6] = function LD_Vx_byte({ x, byte }) {
    V[x] = byte;
  }

  // 7xkk - ADD Vx, byte
  Op[0x7] = function ADD_Vx_byte({ x, byte }) {
    V[x] += byte;
  }

  // Dispatch to 8xxn Ops
  Op[0x8] = function (opcode) {
    Op0x8[opcode.lo](opcode);
  }

  // 8xy0 - LD Vx, Vy
  Op0x8[0x0] = function LD_Vx_Vy({ x, y }) {
    V[x] = V[y];
  }

  // 8xy1 - OR Vx, Vy
  Op0x8[0x1] = function OR_Vx_Vy({ x, y }) {
    V[x] |= V[y];
  }

  // 8xy2 - AND Vx, Vy
  Op0x8[0x2] = function AND_Vx_Vy({ x, y }) {
    V[x] &= V[y];
  }

  // 8xy3 - XOR Vx, Vy
  Op0x8[0x3] = function XOR_Vx_Vy({ x, y }) {
    V[x] ^= V[y];
  }

  // 8xy4 - ADD Vx, Vy
  Op0x8[0x4] = function ADD_Vx_Vy({ x, y }) {
    let res = V[x] + V[y];
    V[0xF] = res > 0xFF ? 1 : 0;
    V[x] = res;
  }

  // 8xy5 - SUB Vx, Vy
  Op0x8[0x5] = function SUB_Vx_Vy({ x, y }) {
    let Vx = V[x];
    let Vy = V[y];

    // If Vx > Vy, then VF is set to 1, otherwise 0.
    V[0xF] = Vx > Vy ? 1 : 0;
    V[x] = Vx - Vy;
  }

  // 8xy6 - SHR Vx {, Vy}
  Op0x8[0x6] = function SHR_Vx({ x }) {
    let Vx = V[x];

    V[0xF] = 0x1 & Vx;
    V[x] = Vx >> 1;
  }

  // 8xy7 - SUBN Vx, Vy
  Op0x8[0x7] = function SUBN_Vx_Vy({ x, y }) {
    let Vx = V[x];
    let Vy = V[y];

    // If Vy > Vx, then VF is set to 1, otherwise 0.
    V[0xF] = Vy > Vx ? 1 : 0;
    V[x] = Vy - Vx; // will wrap when Uint8Array set
  }

  // 8xyE - SHL Vx {, Vy}
  Op0x8[0xE] = function SHL_Vx_Vy({ x }) {
    let Vx = V[x];

    V[0xF] = Vx >> 7;
    V[x] = Vx << 1;
  }

  // 9xy0 - SNE Vx, Vy
  Op[0x9] = function SNE_Vx_Vy({ x, y }) {
    if (V[x] !== V[y]) programCounter.skip();
  }

  // Annn - LD I, addr
  Op[0xA] = function LD_I_addr({ addr }) {
    I = addr;
  }

  // Bnnn - JP V0, addr
  Op[0xB] = function JP_V0_addr({ addr }) {
    programCounter.jump(V[0] + addr);
  }

  // Cxkk - RND Vx, byte
  Op[0xC] = function RND_Vx_byte({ x, byte }) {
    V[x] = (Math.random() * 0x100) & byte;
  }

  // Dxyn - DRW Vx, Vy, nibble
  Op[0xD] = function DRW_Vx_Vy_n({ x, y, lo: n }) {
    let Vx = V[x];
    let Vy = V[y];
    V[0xF] = 0;
    for (let sy = 0; sy < n; sy++) {
      let dy = (Vy + sy) % SIZE.SCREEN_HEIGHT;
      let yline = RAM[I + sy];
      for (let sx = 0; sx < 8; sx++) {
        // loop over the bits of the byte
        let px = (yline >> (7 - sx)) & 1;
        let dx = (Vx + sx) % SIZE.SCREEN_WIDTH;
        let idx = dy * SIZE.SCREEN_WIDTH + dx;
        pixels[idx] ^= px;
        V[0xF] |= pixels[idx] == 0 && px == 1 ? 1 : 0;
      }
    }

    vm.draw();
  }

  // Dispatch to 9xxx Ops
  Op[0xE] = function (opcode) {
    Op0xE[ opcode.byte ](opcode);
  }

  // Ex9E - SKP Vx
  Op0xE[0x9E] = function SKP_Vx(opcode) {

    let { x } = opcode;

    if (keys[ V[x] ] === 1) programCounter.skip();
  }

  // ExA1 - SKNP Vx
  Op0xE[0xA1] = function SKNP_Vx(opcode) {

    let { x } = opcode;

    if (keys[ V[x] ] !== 1) programCounter.skip();
  }

  // Dispatch to Fxxx Ops
  Op[0xF] = function (opcode) {
    Op0xF[opcode.byte](opcode);
  }

  // Fx07 - LD Vx, DT
  Op0xF[0x07] = function LD_Vx_DT(opcode) {
    let { x } = opcode;

    V[x] = vm.delayTimer;
  }

  // Fx0A - LD Vx, K
  Op0xF[0x0A] = function LD_Vx_K(opcode) {
    const { x } = opcode;

    vm.waitForKey(key => V[x] = key);
  }

  // Fx15 - LD DT, Vx
  Op0xF[0x15] = function LD_DT_Vx({ x }) {
    vm.delayTimer = V[x];
  }

  // Fx18 - LD ST, Vx
  Op0xF[0x18] = function LD_ST_Vx({ x }) {
    vm.soundTimer = V[x];
  }

  // Fx1E - ADD I, Vx
  Op0xF[0x1E] = function ADD_I_Vx({ x }) {
    I += V[x];
  }

  // Fx29 - LD F, Vx
  Op0xF[0x29] = function LD_F_Vx({ x }) {
    I = V[x] * SIZE.FONT_WIDTH;
  }

  // Fx33 - LD BCD, Vx
  Op0xF[0x33] = function LD_BCD_Vx({ x }) {
    let Vx = V[x];

    let bcd = (Vx / 100) | 0;
    RAM[I] = bcd;
    Vx -= bcd * 100;
    bcd = (Vx / 10) | 0;
    RAM[I + 1] = bcd;
    Vx -= bcd * 10;
    RAM[I + 2] = Vx;
  }

  // Fx55 - LD [I], Vx
  Op0xF[0x55] = function LD_I_Vx({ x }) {
    for(let i = 0; i <= x; i++) {
      RAM[I + i] = V[i];
    }
  }

  // Fx65 - LD Vx, [I]
  Op0xF[0x65] = function LD_Vx_I({ x }) {
    for(let i = 0; i <= x; i++) {
      V[i] = RAM[I + i];
    }
  }

  return {
    execOp() {
      let opcode = programCounter.next();
      Op[opcode.hi](opcode);
    }
  }
}
