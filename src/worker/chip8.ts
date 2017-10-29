import createVirtualMachine from "./vm";

const vm = createVirtualMachine({
  draw(pixels) {
    postMessage({
      cmd: "draw",
      pixels,
    });
  },
  startTone() {
    postMessage({
      cmd: "startTone",
    });
  },
  stopTone() {
    postMessage({
      cmd: "stopTone",
    });
  },
});

function readROMFile(file: File) {
  const reader = new FileReaderSync();
  const buffer = reader.readAsArrayBuffer(file);
  vm.loadROM(new Uint8Array(buffer));
}

onmessage = (msg: MessageEvent) => {
  switch (msg.data.cmd) {
    case "load":
      readROMFile(msg.data.rom);
      break;
    case "keydown":
      vm.keyDown(msg.data.key);
      break;
    case "keyup":
      vm.keyUp(msg.data.key);
      break;
  }
};
