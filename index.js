(function () {
'use strict';

function keyFor(keyCode) {
    switch (keyCode) {
        case 88 /* KEY_X */: return 0 /* KEY_0 */;
        case 49 /* KEY_1 */: return 1 /* KEY_1 */;
        case 50 /* KEY_2 */: return 2 /* KEY_2 */;
        case 51 /* KEY_3 */: return 3 /* KEY_3 */;
        case 81 /* KEY_Q */: return 4 /* KEY_4 */;
        case 87 /* KEY_W */: return 5 /* KEY_5 */;
        case 69 /* KEY_E */: return 6 /* KEY_6 */;
        case 65 /* KEY_A */: return 7 /* KEY_7 */;
        case 83 /* KEY_S */: return 8 /* KEY_8 */;
        case 68 /* KEY_D */: return 9 /* KEY_9 */;
        case 90 /* KEY_Z */: return 10 /* KEY_A */;
        case 67 /* KEY_C */: return 11 /* KEY_B */;
        case 52 /* KEY_4 */: return 12 /* KEY_C */;
        case 82 /* KEY_R */: return 13 /* KEY_D */;
        case 70 /* KEY_F */: return 14 /* KEY_E */;
        case 86 /* KEY_V */: return 15 /* KEY_F */;
        default: return -1 /* NONE */;
    }
}

var context = typeof AudioContext !== "undefined" ? new AudioContext() : new webkitAudioContext();
var Sound = function Sound() {
    this.oscillator = undefined;
};
Sound.prototype.startTone = function startTone () {
    if (this.oscillator) {
        this.oscillator.stop();
    }
    var oscillator = this.oscillator = context.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = 262;
    oscillator.connect(context.destination);
    oscillator.start((context.currentTime % 262) / 1000);
};
Sound.prototype.stopTone = function stopTone () {
    var oscillator = this.oscillator;
    if (oscillator) {
        oscillator.stop((context.currentTime % 262) / 1000);
        this.oscillator = undefined;
    }
};

var Program = function Program(gl) {
    this.gl = gl;
    var program = gl.createProgram();
    if (!program)
        { throw new Error("failed to create program"); }
    this.program = program;
};
Program.prototype.attachVertexShader = function attachVertexShader (source) {
    this.attachShader(this.gl.VERTEX_SHADER, source);
};
Program.prototype.attachFragmentShader = function attachFragmentShader (source) {
    this.attachShader(this.gl.FRAGMENT_SHADER, source);
};
Program.prototype.attachShader = function attachShader (type, source) {
    var ref = this;
        var gl = ref.gl;
        var program = ref.program;
    var shader = gl.createShader(type);
    if (!shader)
        { throw new Error("failed to create shader"); }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var log = gl.getShaderInfoLog(shader);
        throw new Error(log || "compile shader failed");
    }
    gl.attachShader(program, shader);
};
Program.prototype.link = function link () {
    var ref = this;
        var gl = ref.gl;
        var program = ref.program;
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var log = gl.getProgramInfoLog(program);
        throw new Error(log || "link program failed");
    }
};
Program.prototype.draw = function draw (drawable) {
    drawable.draw(this.program);
};
Program.prototype.uniformLocation = function uniformLocation (name) {
    return this.gl.getUniformLocation(this.program, name);
};
Program.prototype.attributeLocation = function attributeLocation (name) {
    return this.gl.getAttribLocation(this.program, name);
};

var VERTEX_SHADER = "\nprecision lowp float;\nattribute vec2 vertex;\nvarying vec2 uv;\nconst vec2 scale = vec2(0.5, 0.5);\nvoid main()\n{\n  // map -1 to 1 to 0 to 1\n  uv  = vertex * scale + scale;\n  gl_Position = vec4(vertex, 0.0, 1.0);\n}\n";
var FRAGMENT_SHADER = "\nprecision mediump float;\nuniform sampler2D screen;\nvarying vec2 uv;\nvoid main()\n{\n  gl_FragColor = texture2D(screen, uv);\n}\n";
var VERTICES = new Float32Array([
    -1, 1,
    -1, -1,
    1, 1,
    1, -1
]);
var Quad = function Quad(gl) {
      var this$1 = this;

      this.gl = gl;
      var buffer = gl.createBuffer();
      if (!buffer)
          { throw new Error("failed to create quad buffer"); }
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);
      var texture = gl.createTexture();
      if (!texture)
          { throw new Error("failed to create quad buffer"); }
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      var program = new Program(gl);
      program.attachVertexShader(VERTEX_SHADER);
      program.attachFragmentShader(FRAGMENT_SHADER);
      program.link();
      var screen = program.uniformLocation("screen");
      if (screen === null)
          { throw new Error("missing uniform screen"); }
      var uniforms = {
          screen: screen
      };
      var attributes = {
          vertex: program.attributeLocation("vertex")
      };
      gl.enableVertexAttribArray(attributes.vertex);
      var tick = function () {
          this$1.render();
          requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      this.buffer = buffer;
      this.texture = texture;
      this.program = program;
      this.uniforms = uniforms;
      this.attributes = attributes;
      this.tick = tick;
  };
  Quad.prototype.draw = function draw (program) {
      var ref = this;
        var gl = ref.gl;
        var attributes = ref.attributes;
        var uniforms = ref.uniforms;
      gl.useProgram(program);
      gl.vertexAttribPointer(attributes.vertex, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1i(uniforms.screen, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  Quad.prototype.render = function render () {
      this.program.draw(this);
  };
  Quad.prototype.uploadTexture = function uploadTexture (rgb, width, height) {
      var ref = this;
        var gl = ref.gl;
        var texture = ref.texture;
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, rgb);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  };

var WIDTH = 64;
var HEIGHT = 32;
var ColorMap = {};
ColorMap[0 /* Off */] = 0;
ColorMap[1 /* On */] = 255;
var Graphics = function Graphics(gl) {
    this.gl = gl;
    var quad = this.quad = new Quad(gl);
    var rgb = this.rgb = new Uint8Array(WIDTH * HEIGHT * 3);
    quad.uploadTexture(rgb, WIDTH, HEIGHT);
};
Graphics.prototype.draw = function draw (pixels) {
    var rgb = this.rgb;
    for (var y = 0; y < HEIGHT; y++) {
        for (var x = 0; x < WIDTH; x++) {
            var pixelIndex = y * WIDTH + x;
            var color = ColorMap[pixels[pixelIndex]];
            var index = pixelIndex * 3;
            rgb[index] = color;
            rgb[index + 1] = color;
            rgb[index + 2] = color;
        }
    }
    this.quad.uploadTexture(rgb, WIDTH, HEIGHT);
};

var Chip8Host$1 = function Chip8Host(worker, window, input, gl) {
    this.worker = worker;
    this.input = input;
    this.graphics = new Graphics(gl);
    this.sound = new Sound();
    worker.onmessage = this.onmessage.bind(this);
    worker.onerror = this.onerror.bind(this);
    window.onkeydown = this.onkeydown.bind(this);
    window.onkeyup = this.onkeyup.bind(this);
    input.onchange = this.onchange.bind(this);
};
Chip8Host$1.prototype.onmessage = function onmessage (msg) {
    switch (msg.data.cmd) {
        case "draw":
            this.graphics.draw(msg.data.pixels);
            break;
        case "startTone":
            this.sound.startTone();
            break;
        case "stopTone":
            this.sound.stopTone();
            break;
        default:
            throw new Error(("unknown command " + (msg.data.cmd)));
    }
};
Chip8Host$1.prototype.onchange = function onchange () {
    var files = this.input.files;
    if (!files || files.length === 0)
        { return; }
    var rom = files[0];
    this.worker.postMessage({ cmd: "load", rom: rom });
};
Chip8Host$1.prototype.onkeydown = function onkeydown (evt) {
    var key = keyFor(evt.keyCode);
    if (key === -1 /* NONE */)
        { return; }
    this.worker.postMessage({ cmd: "keydown", key: key });
};
Chip8Host$1.prototype.onkeyup = function onkeyup (evt) {
    var key = keyFor(evt.keyCode);
    if (key === -1 /* NONE */)
        { return; }
    this.worker.postMessage({ cmd: "keyup", key: key });
};
Chip8Host$1.prototype.onerror = function onerror (evt) {
    console.error(evt.error);
};

var canvas = document.getElementById("screen");
var input = document.querySelector('input[type="file"]');
var gl = getWebGLContext(canvas);
if (gl == null)
    { throw new Error("failed to get gl context"); }
var worker = new Worker("worker/chip8.js");
var host = new Chip8Host$1(worker, self, input, gl);
function getWebGLContext(canvas) {
    var gl = canvas.getContext("webgl");
    if (!gl)
        { throw new Error("no webgl"); }
    return gl;
}

}());

//# sourceMappingURL=index.js.map
