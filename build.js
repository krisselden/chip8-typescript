const { Builder, Generator } = require('./dist/generator');
const Binaryen = require('binaryen');
const fs = require('fs');
const json = JSON.parse(
  fs.readFileSync(__dirname + '/src/generator/opcodes.json','utf8'));
const opcodes = Object.keys(json);

const builder = new Builder(opcodes);
const mod = new Binaryen.Module();
const generator = new Generator(mod);
const graph = builder.buildGraph();
generator.addOpImports(builder.opcodePatterns);
generator.addUnknownOpImport();
generator.addDispatchFunction("dispatch", graph);
mod.addExport("dispatch", "dispatch");

console.log(mod.emitText());
