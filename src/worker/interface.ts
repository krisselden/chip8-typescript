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
