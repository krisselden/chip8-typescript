import Program, { IDrawable } from "./program";

const VERTEX_SHADER = `
precision lowp float;
attribute vec2 vertex;
varying vec2 uv;
const vec2 scale = vec2(0.5, 0.5);
void main()
{
  // map -1 to 1 to 0 to 1
  uv  = vertex * scale + scale;
  gl_Position = vec4(vertex, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D screen;
varying vec2 uv;
void main()
{
  gl_FragColor = texture2D(screen, uv);
}
`;

const VERTICES = new Float32Array([
  -1,  1,
  -1, -1,
   1,  1,
   1, -1,
]);

export default class Quad implements IDrawable {
  private buffer: WebGLBuffer;
  private texture: WebGLTexture;

  private program: Program;

  private uniforms: { screen: WebGLUniformLocation };
  private attributes: { vertex: number };

  private tick: () => void;

  constructor(private gl: WebGLRenderingContext) {
    const buffer = gl.createBuffer();
    if (!buffer) {
      throw new Error("failed to create quad buffer");
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);

    const texture = gl.createTexture();
    if (!texture) {
      throw new Error("failed to create quad buffer");
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const program = new Program(gl);
    program.attachVertexShader(VERTEX_SHADER);
    program.attachFragmentShader(FRAGMENT_SHADER);
    program.link();

    const screen = program.uniformLocation("screen");
    if (screen === null) {
      throw new Error("missing uniform screen");
    }

    const uniforms = { screen };

    const attributes = {
      vertex: program.attributeLocation("vertex"),
    };

    gl.enableVertexAttribArray(attributes.vertex);

    const tick = () => {
      this.render();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    this.buffer = buffer;
    this.texture = texture;
    this.program = program;
    this.uniforms = uniforms;
    this.attributes = attributes;
    this.tick = tick;
  }

  public draw(program: WebGLProgram) {
    const { gl, attributes, uniforms } = this;
    gl.useProgram(program);
    gl.vertexAttribPointer(attributes.vertex, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(uniforms.screen, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  public uploadTexture(rgb: Uint8Array, width: number, height: number) {
    const { gl, texture } = this;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, rgb);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  }

  private render() {
    this.program.draw(this);
  }
}
