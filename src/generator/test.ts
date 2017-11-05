import * as Binaryen from "binaryen";
import {
  Builder,
  Generator,
} from "./index";

QUnit.module("Builder", () => {
  QUnit.test("switch graph is simplified", (assert) => {
    const builder = new Builder(["DXY0", "DXYN"]);
    const graph = builder.buildGraph();
    assert.deepEqual(graph, {
      "": {
        13: "D__",
      },
      "D__": {
        0: "D__0",
        default: "D___",
      },
      "D__0": "DXY0",
      "D___": "DXYN",
    });
  });
});

QUnit.module("Generator", () => {
  QUnit.test("get opcode part", (assert) => {
    const mod = new Binaryen.Module();
    const generator = new Generator(mod);
    generator.addFunction("getX", [Binaryen.i32],
      generator.getOpcodePart(1, 1), Binaryen.i32);
    generator.addFunction("getY", [Binaryen.i32],
      generator.getOpcodePart(2, 1), Binaryen.i32);
    generator.addFunction("getNNN", [Binaryen.i32],
      generator.getOpcodePart(1, 3), Binaryen.i32);
    generator.addFunction("getKK", [Binaryen.i32],
      generator.getOpcodePart(2, 2), Binaryen.i32);
    generator.addFunction("getN", [Binaryen.i32],
      generator.getOpcodePart(3, 1), Binaryen.i32);
    generator.addFunction("getHi", [Binaryen.i32],
      generator.getOpcodePart(0, 1), Binaryen.i32);
    mod.addExport("getX", "getX");
    mod.addExport("getY", "getY");
    mod.addExport("getNNN", "getNNN");
    mod.addExport("getKK", "getKK");
    mod.addExport("getN", "getN");
    mod.addExport("getHi", "getHi");
    const wasmModule = new WebAssembly.Module(mod.emitBinary());
    // // tslint:disable-next-line:no-console
    // console.log(mod.emitText());
    mod.dispose();
    const wasmInstance = new WebAssembly.Instance(wasmModule, {});
    assert.equal(wasmInstance.exports.getHi( 0x8F35), 0x0008);
    assert.equal(wasmInstance.exports.getX(  0x8F35), 0x000F);
    assert.equal(wasmInstance.exports.getY(  0x8F35), 0x0003);
    assert.equal(wasmInstance.exports.getN(  0x8F35), 0x0005);
    assert.equal(wasmInstance.exports.getNNN(0x8F35), 0x0F35);
    assert.equal(wasmInstance.exports.getKK( 0x8F35), 0x0035);
  });

  QUnit.test("build dispatch function", (assert) => {
    const builder = new Builder(["DXY0", "DXYN"]);
    const mod = new Binaryen.Module();
    const generator = new Generator(mod);
    const graph = builder.buildGraph();
    generator.addOpImports(builder.opcodePatterns);
    generator.addUnknownOpImport();
    generator.addDispatchFunction("dispatch", graph);
    mod.addExport("dispatch", "dispatch");
    const wasmModule = new WebAssembly.Module(mod.emitBinary());
    // // tslint:disable-next-line:no-console
    // console.log(mod.emitText());
    mod.dispose();
    const wasmInstance = new WebAssembly.Instance(wasmModule, {
      env: {
        unknownOp(opcode: number) {
          assert.equal(opcode, 0x1234);
        },
        DXY0(x: number, y: number) {
          assert.equal(x, 1);
          assert.equal(y, 2);
        },
        DXYN(x: number, y: number, n: number) {
          assert.equal(x, 3);
          assert.equal(y, 4);
          assert.equal(n, 5);
        },
      },
    });
    wasmInstance.exports.dispatch(0xD345);
    wasmInstance.exports.dispatch(0xD120);
    wasmInstance.exports.dispatch(0x1234);
  });
});

declare const WebAssembly: any;
