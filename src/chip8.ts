import createVirtualMachine from "./vm";

const vm = createVirtualMachine({
  draw(pixels) {
    postMessage({
      cmd: "draw",
      pixels
    });
  },
  startTone() {
    postMessage({
      cmd: "startTone"
    });
  },
  stopTone() {
    postMessage({
      cmd: "stopTone"
    });
  }
});

function readROMFile(file: File) {
  let reader = new FileReaderSync();
  let buffer = reader.readAsArrayBuffer(file);
  vm.loadROM(new Uint8Array(buffer));
}

onmessage = function(msg: MessageEvent) {
  switch (msg.data.cmd) {
    case "load":
      readROMFile(msg.data.rom);
      break;
    case "keydown":
      break;
    case "keyup":
      break;
  }
}
