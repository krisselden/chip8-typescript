import keyFor, { Keys } from "./key_for";
import Sound from "./sound";
import Graphics from "./graphics";

export default class Chip8Host {
  private sound: Sound;
  private graphics: Graphics;

  constructor(private worker: Worker, window: Window, private input: HTMLInputElement, gl: WebGLRenderingContext) {
    this.graphics = new Graphics(gl);
    this.sound = new Sound();
    worker.onmessage = this.onmessage.bind(this);
    worker.onerror = this.onerror.bind(this);
    window.onkeydown = this.onkeydown.bind(this);
    window.onkeyup = this.onkeyup.bind(this);
    input.onchange = this.onchange.bind(this);
  }

  onmessage(msg: MessageEvent) {
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
        throw new Error(`unknown command ${msg.data.cmd}`);
    }
  }

  onchange() {
    let files = this.input.files;
    if (!files || files.length === 0) return;
    let rom = files[0];
    this.worker.postMessage({ cmd: "load", rom });
  }

  onkeydown(evt: KeyboardEvent) {
    let key = keyFor(evt.keyCode);
    if (key === Keys.NONE) return;
    this.worker.postMessage({ cmd: "keydown", key });
  }

  onkeyup(evt: KeyboardEvent) {
    let key = keyFor(evt.keyCode);
    if (key === Keys.NONE) return;
    this.worker.postMessage({ cmd: "keyup", key });
  }

  onerror(evt: ErrorEvent) {
    console.error(evt.error);
  }
}
