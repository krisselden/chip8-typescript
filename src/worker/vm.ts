import { FONT, OFFSET, SIZE } from "./constants";
import createOperations, { IOperations, IVirtualMachine } from "./operations";

export interface IVirtualMachineOuput {
  draw(pixels: Uint8Array): void;
  startTone(): void;
  stopTone(): void;
}

export interface IVirtualMachineInput {
  loadROM(ROM: Uint8Array): void;
  keyUp(key: number): void;
  keyDown(key: number): void;
}

export default function createVirtualMachine(delegate: IVirtualMachineOuput): IVirtualMachineInput {
  const RAM = new Uint8Array(SIZE.RAM_SIZE);
  const pixels = new Uint8Array(SIZE.SCREEN_SIZE);
  const keys = new Uint8Array(SIZE.KEY_SIZE);
  const vm: IVirtualMachine = {
    RAM,
    pixels,
    draw() {
      delegate.draw(pixels);
    },
    // tslint:disable-next-line:object-literal-sort-keys
    keys,
    soundTimer: 0,
    delayTimer: 0,
    waitForKey(cb) {
      waitForKeyCallback = cb;
      pause();
    },
  };

  let waitForKeyCallback: ((key: number) => void) | undefined;
  let interval: any;
  let operations: IOperations;

  let cycleCount: number;

  let soundOn = false;
  let paused = false;
  let start = Date.now();

  function flush() {
    while (!paused) {
      const elapsed = Date.now() - start;
      // 600hz
      const idealCycles = (elapsed * 600 / 1000) | 0;
      if (cycleCount >= idealCycles) {
        break;
      }

      for (; cycleCount < idealCycles; cycleCount++) {
        operations.execOp();
        if (paused) {
          return;
        }

        // decrement at 60hz
        if (cycleCount % 10 === 0) {
          if (vm.delayTimer > 0) {
            vm.delayTimer--;
          }
          if (vm.soundTimer > 0) {
            vm.soundTimer--;
          }
        }
        if (vm.soundTimer > 0) {
          if (!soundOn) {
            soundOn = true;
            delegate.startTone();
          }
        } else {
          if (soundOn) {
            soundOn = false;
            delegate.stopTone();
          }
        }
      }
    }
  }

  function pause() {
    clearInterval(interval);
    delegate.stopTone();
    soundOn = false;
    paused = true;
  }

  function resume() {
    start = Date.now();
    cycleCount = 0;
    interval = setInterval(flush, 16);
    paused = false;
  }

  return {
    loadROM(ROM) {
      pause();
      RAM.set(FONT);
      RAM.fill(0, FONT.length, OFFSET.PROGRAM_START);
      RAM.set(ROM, OFFSET.PROGRAM_START);
      RAM.fill(0, OFFSET.PROGRAM_START + ROM.length);
      pixels.fill(0);
      operations = createOperations(vm);
      resume();
    },
    keyUp(key) {
      keys[key] = 0;
      flush();
    },
    keyDown(key) {
      if (waitForKeyCallback) {
        waitForKeyCallback(key);
        waitForKeyCallback = undefined;
        resume();
      }
      keys[key] = 1;
      flush();
    },
  };
}
