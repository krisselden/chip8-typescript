import Graphics from "./graphics";
import keyFor, { Keys } from "./key_for";
import Sound from "./sound";

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

  public onmessage(msg: MessageEvent) {
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

  private onchange() {
    const files = this.input.files;
    if (!files || files.length === 0) {
      return;
    }
    const rom = files[0];
    this.worker.postMessage({ cmd: "load", rom });
  }

  private onkeydown(evt: KeyboardEvent) {
    const key = keyFor(evt.keyCode);
    if (key === Keys.NONE) {
      return;
    }
    this.worker.postMessage({ cmd: "keydown", key });
  }

  private onkeyup(evt: KeyboardEvent) {
    const key = keyFor(evt.keyCode);
    if (key === Keys.NONE) {
      return;
    }
    this.worker.postMessage({ cmd: "keyup", key });
  }

  private onerror(evt: ErrorEvent) {
    // tslint:disable-next-line:no-console
    console.error(evt.error);
  }
}
