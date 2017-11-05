import * as Binaryen from "binaryen";
import { IGraph, ISwitch } from "./types";
import { getArgs, getParams } from "./util";

export const DefaultExternalOpcodeName = (opcodePattern: string) => opcodePattern;

export class Generator {
  constructor(public module: Binaryen.Module) {
  }

  /**
   * Gets or adds the signature to the module.
   * @param resultType {Binaryen.Type}
   * @param paramTypes {Binaryen.Type[]}
   */
  public getSignature(resultType: Binaryen.Type, paramTypes: Binaryen.Type[]): Binaryen.Signature {
    let sig = this.module.getFunctionTypeBySignature(resultType, paramTypes);
    if (sig === 0) {
      sig = this.module.addFunctionType(
        getSignatureLabel(resultType, paramTypes),
        resultType,
        paramTypes,
      );
    }
    return sig;
  }

  public addOpImports(opcodePatterns: string[],
                      externalName = DefaultExternalOpcodeName,
                      externalModuleName = "env") {
    opcodePatterns.forEach((opcodePattern) => {
      this.addOpImport(opcodePattern, externalName, externalModuleName);
    });
  }

  public addOpImport(opcodePattern: string,
                     // tslint:disable-next-line:no-shadowed-variable
                     externalName = DefaultExternalOpcodeName,
                     externalModuleName = "env") {
    const { module } = this;
    const sig = this.getSignature(Binaryen.none, getParams(opcodePattern));
    module.addImport(opcodePattern, externalModuleName, externalName(opcodePattern), sig);
  }

  public addUnknownOpImport(externalName = "unknownOp", externalModuleName = "env") {
    const sig = this.getSignature(Binaryen.none, [Binaryen.i32]);
    this.module.addImport("unknownOp", externalModuleName, externalName, sig);
  }

  /**
   * Returns an expression to shift and/or mask part of the opcode param.
   * @param pos {number} 0 based index of 4-bit parts left to right
   * @param size {number} number of 4-bit parts
   */
  public getOpcodePart(pos: number, size: number): Binaryen.F32Expression {
    const module = this.module;
    let opcode = module.getLocal(0, Binaryen.i32);
    const shr = (4 - (pos + size)) * 4;
    const mask = (1 << (4 * size)) - 1;
    if (shr > 0) {
      opcode = module.i32.shr_u(opcode, module.i32.const(shr));
    }
    if (pos > 0) {
      opcode = module.i32.and(opcode, module.i32.const(mask));
    }
    return opcode;
  }

  public addFunction(name: string,
                     paramTypes: Binaryen.Type[],
                     body: Binaryen.Statement,
                     resultType = Binaryen.none,
                     varTypes: Binaryen.Type[] = []) {
    return this.module.addFunction(
      name, this.getSignature(resultType, paramTypes), varTypes, body);
  }

  public addDispatchFunction(name: string, graph: IGraph): Binaryen.Function {
    const { module } = this;
    return this.addFunction(name, [Binaryen.i32], module.block("leave", [
      module.block("unknown", [
        ...this.getBlock("", graph),
        module.break("leave")]),
      this.getCallUnknown(),
    ]));
  }

  public getCallUnknown() {
    const { module } = this;
    const vi = this.getSignature(Binaryen.none, [Binaryen.i32]);
    const params = [module.getLocal(0, Binaryen.i32)];
    return module.callImport("unknownOp", params, vi);
  }

  public getBlock(label: string, graph: IGraph): Binaryen.Statement[] {
    const node = graph[label];
    if (typeof node === "string") {
      return [ this.getCallOp(node) ];
    } else {
      return this.getSwitchBlock(label, node, graph);
    }
  }

  public getSwitch(label: string, node: ISwitch): Binaryen.Statement {
    const labels: string[] = [];
    const defaultLabel = node.default === undefined ? "unknown" : node.default;
    let maxNonDefault = 0;
    for (let i = 0; i < 16; i++) {
      if (node[i] !== undefined) {
        labels.push(node[i]);
        maxNonDefault = i + 1;
      } else {
        labels.push(defaultLabel);
      }
    }
    labels.length = maxNonDefault;
    const cond = this.getOpcodePart(label.length, 1);
    return this.module.switch(labels, defaultLabel, cond);
  }

  public getSwitchBlock(label: string, node: ISwitch, graph: IGraph): Binaryen.Statement[] {
    let breakStatement = this.getSwitch(label, node);
    let blockStatements: Binaryen.Statement[] = [];
    const cases = Object.keys(node);
    const { module } = this;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < cases.length; i++) {
      const childLabel = node[cases[i]];
      blockStatements.push(breakStatement);
      blockStatements = [
        module.block(childLabel, blockStatements),
        ...this.getBlock(childLabel, graph),
      ];
      breakStatement = module.break("leave");
    }
    return blockStatements;
  }

  public getCallOp(opcodePattern: string): Binaryen.Statement {
    const sig = this.getSignature(Binaryen.none, getParams(opcodePattern));
    const params = getArgs(opcodePattern).map((arg) => this.getOpcodePart(arg.pos, arg.size));
    const { module } = this;
    return module.callImport(opcodePattern, params, sig);
  }
}

function getSignatureLabel(resultType: Binaryen.Type, paramTypes: Binaryen.Type[]) {
  return typeChar(resultType) + paramTypes.map(typeChar).join("");
}

function typeChar(t: Binaryen.Type) {
  switch (t) {
    case Binaryen.none: return "v";
    case Binaryen.i32: return "i";
    case Binaryen.i64: return "I";
    case Binaryen.f32: return "f";
    case Binaryen.f64: return "F";
    default: throw new Error("unknown type");
  }
}
