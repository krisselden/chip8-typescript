import { OFFSET, SIZE } from "./constants";
import * as t from "./interface";

class Opcode {
  public raw = 0;

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

// tslint:disable-next-line:max-classes-per-file
class ProgramCounter {
  private pc = OFFSET.PROGRAM_START;
  private sp = 0;
  private stack = new Uint16Array(SIZE.STACK_SIZE);
  private opcode = new Opcode();

  constructor(private RAM: Uint8Array) {
  }

  public jump(addr: number) {
    this.pc = addr;
  }

  public push() {
    this.stack[this.sp++] = this.pc;
  }

  public pop() {
    this.pc = this.stack[--this.sp];
  }

  public skip() {
    this.pc += 2;
  }

  public next(): t.IOpCode {
    const hi = this.RAM[this.pc] << 8;
    const lo = this.RAM[this.pc + 1];
    this.opcode.raw = hi | lo;
    this.pc += 2;
    return this.opcode;
  }
}

export default function createProgramCounter(RAM: Uint8Array): t.IProgramCounter {
  return new ProgramCounter(RAM);
}
