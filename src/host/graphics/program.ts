export interface Drawable {
  draw(program: WebGLProgram): void;
}

export default class Program {
  program: WebGLProgram;

  constructor(private gl: WebGLRenderingContext) {
    let program = gl.createProgram();
    if (!program) throw new Error("failed to create program");
    this.program = program;
  }

  attachVertexShader(source: string) {
    this.attachShader(this.gl.VERTEX_SHADER, source);
  }

  attachFragmentShader(source: string) {
    this.attachShader(this.gl.FRAGMENT_SHADER, source);
  }

  attachShader(type: number, source: string) {
    let { gl, program } = this;
    let shader = gl.createShader(type);
    if (!shader) throw new Error("failed to create shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let log = gl.getShaderInfoLog(shader);
      throw new Error(log || "compile shader failed");
    }
    gl.attachShader(program, shader);
  }

  link() {
    let { gl, program } = this;
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      let log = gl.getProgramInfoLog(program);
      throw new Error(log || "link program failed");
    }
  }

  draw(drawable: Drawable) {
    drawable.draw(this.program);
  }

  uniformLocation(name: string) {
    return this.gl.getUniformLocation(this.program, name);
  }

  attributeLocation(name: string) {
    return this.gl.getAttribLocation(this.program, name);
  }
}
