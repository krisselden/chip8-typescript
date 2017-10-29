var Buffer = require('buffer').Buffer;
var path = require('path');
var Rollup = require('broccoli-rollup');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');
var typescript = require('broccoli-typescript-compiler').typescript;
var fs = require('fs');

var SOURCE_MAPPING_DATA_URL = '//# sourceMap';
SOURCE_MAPPING_DATA_URL += 'pingURL=data:application/json;base64,';

module.exports = function () {
  const src = new Funnel("src", {
    destDir: "src"
  });
  const index = typescript(src, {
    annotation: 'compile index.ts',
    rootPath: __dirname,
    buildPath: 'dist',
  });
  const worker = typescript(src, {
    annotation: 'compile chip8.ts',
    rootPath: __dirname,
    buildPath: 'dist',
    tsconfig: 'src/worker/tsconfig.json'
  });
  return new MergeTrees([
    new Funnel("src", {
      include: ['index.html']
    }),
    new Rollup(index, {
      annotation: 'index.js',
      rollup: {
        entry: 'index.js',
        plugins: [ loadWithInlineMap() ],
        sourceMap: true,
        dest: 'index.js',
        format: 'iife'
      }
    }),
    new Rollup(worker, {
      annotation: 'worker/chip8.js',
      rollup: {
        entry: 'worker/chip8.js',
        plugins: [ loadWithInlineMap() ],
        sourceMap: true,
        dest: 'worker/chip8.js',
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
