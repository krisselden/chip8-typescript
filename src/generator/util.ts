import * as Binaryen from "binaryen";
const ARG = /X|Y|N|KK|NNN/g;

export interface IArg {
  /**
   * Pattern name.
   */
  name: "X" | "Y" | "N" | "KK" | "NNN";

  /**
   * Left to right 0 based 4 bit position. Example: in DXYN, Y would be 2.
   */
  pos: number;

  /**
   * Size of arg in 4 bits. Example: NNN == 3 == 12 bits.
   */
  size: number;
}

export function getParams(opcodePattern: string): Binaryen.Type[] {
  const params: Binaryen.Type[] = [];
  let match;
  // tslint:disable-next-line:no-conditional-assignment
  while (match = ARG.exec(opcodePattern)) params.push(Binaryen.i32);
  return params;
}

export function getArgs(opcodePattern: string): IArg[] {
  const args: IArg[] = [];
  let match;
  // tslint:disable-next-line:no-conditional-assignment
  while (match = ARG.exec(opcodePattern)) args.push({
    name: match[0] as "X" | "Y" | "N" | "KK" | "NNN",
    pos: match.index,
    size: match[0].length,
  });
  return args;
}
