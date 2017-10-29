declare const webkitAudioContext: typeof AudioContext;
const context = typeof AudioContext !== "undefined" ? new AudioContext() : new webkitAudioContext();

export default class Sound {
  private oscillator: OscillatorNode | undefined = undefined;

  public startTone() {
    if (this.oscillator) {
      this.oscillator.stop();
    }
    const oscillator = this.oscillator = context.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.value = 262;
    oscillator.connect(context.destination);
    oscillator.start((context.currentTime % 262) / 1000);
  }

  public stopTone() {
    const oscillator = this.oscillator;
    if (oscillator) {
      oscillator.stop((context.currentTime % 262) / 1000);
      this.oscillator = undefined;
    }
  }
}
