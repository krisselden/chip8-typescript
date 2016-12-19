var Buffer = require('buffer').Buffer;
var path = require('path');
var Rollup = require('broccoli-rollup');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var typescript = require('broccoli-typescript-compiler').typescript;
var buble = require('rollup-plugin-buble');
var fs = require('fs');

var SOURCE_MAPPING_DATA_URL = '//# sourceMap';
SOURCE_MAPPING_DATA_URL += 'pingURL=data:application/json;base64,';

module.exports = function () {
  var src = new MergeTrees([new Funnel(path.dirname(require.resolve('typescript/lib/lib.webworker.d.ts')), {
    include: ["lib.*.d.ts"]
  }), "src"]);
  var compiled = typescript(src, {
    annotation: 'compile chip8.ts',
    tsconfig: {
      compilerOptions: {
        module: "es2015",
        moduleResolution: "node",
        target: "es2015",
        declaration: true,
        strictNullChecks: true,
        inlineSourceMap: true,
        inlineSources: true
      },
      files: [
        "lib.es2015.d.ts",
        "lib.dom.d.ts",
        "lib.webworker.d.ts",
        "chip8.ts",
        "index.ts"
      ]
    }
  });
  return new MergeTrees([
    new Funnel(compiled, {
      include: ['**/*.d.ts', "index.js"]
    }),
    new Funnel("src", {
      include: ['index.html']
    }),
    new Rollup(compiled, {
      annotation: 'chip8.js',
      rollup: {
        entry: 'chip8.js',
        plugins: [ loadWithInlineMap(), buble() ],
        sourceMap: true,
        dest: 'chip8.js',
        format: 'iife'
      }
    })
  ], {
    annotation: 'dist'
  });
};

function loadWithInlineMap() {
  return {
    load: function (id) {
      var code = fs.readFileSync(id, 'utf8');
      var result = {
        code: code,
        map: null
      };
      var index = code.lastIndexOf(SOURCE_MAPPING_DATA_URL);
      if (index === -1) {
        return result;
      }
      result.code = code;
      result.map = parseSourceMap(code.slice(index + SOURCE_MAPPING_DATA_URL.length));
      return result;
    }
  };
}

function parseSourceMap(base64) {
  return JSON.parse(new Buffer(base64, 'base64').toString('utf8'));
}
