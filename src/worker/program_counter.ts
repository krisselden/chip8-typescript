import { OFFSET, SIZE } from "./constants";
import * as t from "./interface";

class Opcode {
  raw = 0;

  get addr() {
    return (this.raw & 0x0FFF);
  }
  get byte() {
    return (this.raw & 0x00FF);
  }
  get hi()   {
    return (this.raw & 0xF000) >> 12;
  }
  get lo()   {
    return (this.raw & 0x000F);
  }
  get x()    {
    return (this.raw & 0x0F00) >>  8;
  }
  get y()    {
    return (this.raw & 0x00F0) >>  4;
  }
}

class ProgramCounter {
  pc = OFFSET.PROGRAM_START;
  sp = 0;
  stack = new Uint16Array(SIZE.STACK_SIZE);
  opcode = new Opcode();

  constructor(private RAM: Uint8Array) {
  }

  jump(addr: number) {
    this.pc = addr;
  }

  push() {
    this.stack[this.sp++] = this.pc;
  }

  pop() {
    this.pc = this.stack[--this.sp];
  }

  skip() {
    this.pc += 2;
  }

  next(): t.OpCode {
    let hi = this.RAM[this.pc] << 8;
    let lo = this.RAM[this.pc + 1];
    this.opcode.raw = hi | lo;
    // console.log(raw);
    this.pc += 2;
    return this.opcode;
  }
}

export default function createProgramCounter(RAM: Uint8Array): t.ProgramCounter {
  return new ProgramCounter(RAM);
}
