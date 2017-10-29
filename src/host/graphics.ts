import Quad from "./graphics/quad";

const WIDTH = 64;
const HEIGHT = 32;

const enum Color {
  Black = 0x00,
  White = 0xFF,
}

const enum Pixel {
  Off = 0,
  On = 1,
}

const ColorMap = {
  [Pixel.Off]: Color.Black,
  [Pixel.On]: Color.White,
};

export default class Graphics {
  private rgb: Uint8Array;
  private quad: Quad;

  constructor(private gl: WebGLRenderingContext) {
    const quad = this.quad = new Quad(gl);
    const rgb = this.rgb = new Uint8Array(WIDTH * HEIGHT * 3);
    quad.uploadTexture(rgb, WIDTH, HEIGHT);
  }

  public draw(pixels: Uint8Array): void {
    const rgb = this.rgb;
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const pixelIndex = y * WIDTH + x;
        const color = ColorMap[pixels[pixelIndex]];
        const index = pixelIndex * 3;
        rgb[index]     = color;
        rgb[index + 1] = color;
        rgb[index + 2] = color;
      }
    }

    this.quad.uploadTexture(rgb, WIDTH, HEIGHT);
  }
}
