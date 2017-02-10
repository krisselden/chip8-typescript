declare const webkitAudioContext: typeof AudioContext;
const context = typeof AudioContext !== "undefined" ? new AudioContext() : <AudioContext>new webkitAudioContext();

export default class Sound {
  oscillator: OscillatorNode | undefined = undefined;

  startTone() {
    if (this.oscillator) {
      this.oscillator.stop();
    }
    let oscillator = this.oscillator = context.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.value = 262;
    oscillator.connect(context.destination);
    oscillator.start((context.currentTime % 262)/ 1000);
  }

  stopTone() {
    let oscillator = this.oscillator;
    if (oscillator) {
      oscillator.stop((context.currentTime % 262)/ 1000);
      this.oscillator = undefined;
    }
  }
}
