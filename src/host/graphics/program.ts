export interface IDrawable {
  draw(program: WebGLProgram): void;
}

export default class Program {
  private program: WebGLProgram;

  constructor(private gl: WebGLRenderingContext) {
    const program = gl.createProgram();
    if (!program) {
      throw new Error("failed to create program");
    }
    this.program = program;
  }

  public attachVertexShader(source: string) {
    this.attachShader(this.gl.VERTEX_SHADER, source);
  }

  public attachFragmentShader(source: string) {
    this.attachShader(this.gl.FRAGMENT_SHADER, source);
  }

  public attachShader(type: number, source: string) {
    const { gl, program } = this;
    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error("failed to create shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      throw new Error(log || "compile shader failed");
    }
    gl.attachShader(program, shader);
  }

  public link() {
    const { gl, program } = this;
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      throw new Error(log || "link program failed");
    }
  }

  public draw(drawable: IDrawable) {
    drawable.draw(this.program);
  }

  public uniformLocation(name: string) {
    return this.gl.getUniformLocation(this.program, name);
  }

  public attributeLocation(name: string) {
    return this.gl.getAttribLocation(this.program, name);
  }
}
