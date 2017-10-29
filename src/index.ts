import Host from "./host/host";

const worker = new Worker("worker/chip8.js");
const host = new Host(
  worker,
  self,
  document.querySelector('input[type="file"]') as HTMLInputElement,
  getWebGLContext(document.getElementById("screen") as HTMLCanvasElement));

function getWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
  const gl = canvas.getContext("webgl");
  if (!gl) {
    throw new Error("no webgl");
  }
  return gl;
}
