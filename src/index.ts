declare var webkitAudioContext: {
  new (): AudioContext;
};

(function () {
  "use strict";
  const canvas = document.getElementById("screen") as HTMLCanvasElement;
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const gl = getWebGLContext(canvas);
  if (gl == null) return;
  const worker = new Worker("worker/chip8.js");

  class Quad implements Drawable {
    buffer: WebGLBuffer;
    constructor(private gl: WebGLRenderingContext) {
      var vertices = new Float32Array([
        // first triangle, vec2 -> vec4 z = 0, w = 1
        1.0, 1.0,
        -1.0, 1.0,
        -1.0, -1.0,
        -1.0, -1.0,
        1.0, -1.0,
        1.0, 1.0]);
      var buffer = gl.createBuffer();
      if (!buffer) throw new Error("failed to create quad buffer");
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      this.buffer = buffer;
    }
    draw(program: WebGLProgram) {
      let gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      let pos = gl.getAttribLocation(program, "pos");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
    }
  }

  class Program {
    program: WebGLProgram;
    constructor(private gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      let program = gl.createProgram();
      if (!program) throw new Error("failed to create program");
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let log = gl.getProgramInfoLog(program);
        throw new Error(log || "failed to link program");
      }
      this.program = program;
    }

    draw(drawable: Drawable) {
      drawable.draw(this.program);
    }
  }

  function compileShader(type: number, source: string): WebGLShader {
    let shader = gl.createShader(type);
    if (!shader) throw new Error("failed to create shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let log = gl.getShaderInfoLog(shader);
      throw new Error(log || "failed to compile shader");
    }
    return shader;
  }

  const screenQuad = new Quad(gl);

  const vertexShader = compileShader(gl.VERTEX_SHADER, `
precision lowp float;
attribute vec2 pos;
varying vec2 texCoords;
const vec2 scale = vec2(0.5, 0.5);
void main()
{
  texCoords  = pos * scale + scale;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`);

  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, `
precision mediump float;
uniform sampler2D screen;
varying vec2 texCoords;
void main()
{
    gl_FragColor = texture2D(screen, texCoords);
}
`);

  const program = new Program(gl, vertexShader, fragmentShader);

  let texData = new Uint8Array(64 * 32 * 3);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 64; x++) {
      let i = y * 64 + x;
      let color = x % 2 === 0 ? y % 2 === 0 ? 0xFF : 0x00 : y % 2 === 0 ? 0x00 : 0xFF;
      texData[i * 3] = color;
      texData[i * 3 + 1] = color;
      texData[i * 3 + 2] = color;
    }
  }

  const texture = gl.createTexture();
  if (!texture) throw new Error("unable to create texture");
  updateTexture(texture, texData, 64, 32);

  function render() {
    gl.useProgram(program.program);
    let screen = gl.getUniformLocation(program.program, "screen");
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(screen, 0);
    program.draw(screenQuad);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  const audioCtx = typeof AudioContext !== "undefined" ? new AudioContext() : <AudioContext>new webkitAudioContext();
  let oscillator: OscillatorNode | undefined;
  worker.onmessage = function (msg) {
    switch (msg.data.cmd) {
      case "draw":
        let pixels = msg.data.pixels;
        let texData = new Uint8Array(32 * 64 * 3);
        for (let y = 0; y < 32; y++) {
          for (let x = 0; x < 64; x++) {
            let i = y * 64 + x;
            texData[i*3]     = pixels[i] * 0xFF;
            texData[i*3 + 1] = pixels[i] * 0xFF;
            texData[i*3 + 2] = pixels[i] * 0xFF;
          }
        }
        updateTexture(texture, texData, 64, 32);
        break;
      case "startTone":
        if (oscillator) {
          oscillator.stop((audioCtx.currentTime % 262)/ 1000);
          oscillator = undefined;
        }
        oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = 262;
        oscillator.connect(audioCtx.destination);
        oscillator.start((audioCtx.currentTime % 262)/ 1000);
        break;
      case "stopTone":
        if (oscillator) {
          oscillator.stop((audioCtx.currentTime % 262)/ 1000);
          oscillator = undefined;
        }
        break;
      default:
        console.error("unknown", msg);
    }
  };

  worker.onerror = function (err) {
    console.error(err);
  };

  input.addEventListener('change', function(this: HTMLInputElement, evt) {
    var files = this.files;
    if (files && files.length > 0) {
      var load = {
        cmd: "load",
        rom: files[0]
      }
      worker.postMessage(load);
    }
  }, false);

  function getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl = canvas.getContext("webgl");
    if (!gl) throw new Error("no webgl");
    return gl;
  }

  function updateTexture(texture: WebGLTexture, data: Uint8Array, width: number, height: number) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  interface Drawable {
    draw(program: WebGLProgram): void;
  }

  const KEY_MAP: {
    [charCode: number]: number | undefined
  } = {
    88: 0x0,
    49: 0x1,
    50: 0x2,
    51: 0x3,
    81: 0x4,
    87: 0x5,
    69: 0x6,
    65: 0x7,
    83: 0x8,
    68: 0x9,
    90: 0xA,
    67: 0xB,
    52: 0xC,
    82: 0xD,
    70: 0xE,
    86: 0xF
  }

  window.onkeydown = function (evt) {
    let key = KEY_MAP[evt.keyCode];
    if (key !== undefined) {
      worker.postMessage({ cmd: "keydown", key });
    }
  };

  window.onkeyup = function (evt) {
    let key = KEY_MAP[evt.keyCode];
    if (key !== undefined) {
      worker.postMessage({ cmd: "keyup", key });
    }
  };
}());
