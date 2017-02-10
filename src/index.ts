import Host from "./host/host";

const canvas = document.getElementById("screen") as HTMLCanvasElement;
const input = document.querySelector('input[type="file"]') as HTMLInputElement;
const gl = getWebGLContext(canvas);
if (gl == null) throw new Error("failed to get gl context");
const worker = new Worker("worker/chip8.js");
const host = new Host(worker, self, input, gl);

function getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
  let gl = canvas.getContext("webgl");
  if (!gl) throw new Error("no webgl");
  return gl;
}
