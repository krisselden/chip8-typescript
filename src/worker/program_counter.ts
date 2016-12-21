import { OFFSET, SIZE } from "./constants";

export interface OpCode {
  readonly addr: number;
  readonly byte: number;
  readonly hi: number;
  readonly lo: number;
  readonly x: number;
  readonly y: number;
}

export interface ProgramCounter {
  jump(addr: number): void;
  push(): void;
  pop(): void;
  skip(): void;
  next(): OpCode;
}

export default function createProgramCounter(RAM: Uint8Array): ProgramCounter {
  let pc = OFFSET.PROGRAM_START;
  let sp = 0;
  const stack = new Uint16Array(SIZE.STACK_SIZE);
  const opcode = {
    raw: 0,
    get addr() {
      return (this.raw & 0x0FFF);
    },
    get byte() {
      return (this.raw & 0x00FF);
    },
    get hi()   {
      return (this.raw & 0xF000) >> 12;
    },
    get lo()   {
      return (this.raw & 0x000F);
    },
    get x()    {
      return (this.raw & 0x0F00) >>  8;
    },
    get y()    {
      return (this.raw & 0x00F0) >>  4;
    }
  };
  return {
    jump(addr: number) {
      pc = addr;
    },
    push() {
      stack[sp++] = pc;
    },
    pop() {
      pc = stack[--sp];
    },
    skip() {
      pc += 2;
    },
    next(): OpCode {
      let hi = RAM[pc] << 8;
      let lo = RAM[pc + 1];
      opcode.raw = hi | lo;
      // console.log(raw);
      pc += 2;
      return opcode;
    }
  }
}
