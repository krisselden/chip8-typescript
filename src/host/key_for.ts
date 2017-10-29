const enum KeyCodes {
  KEY_X = 88,
  KEY_1 = 49,
  KEY_2 = 50,
  KEY_3 = 51,
  KEY_Q = 81,
  KEY_W = 87,
  KEY_E = 69,
  KEY_A = 65,
  KEY_S = 83,
  KEY_D = 68,
  KEY_Z = 90,
  KEY_C = 67,
  KEY_4 = 52,
  KEY_R = 82,
  KEY_F = 70,
  KEY_V = 86,
}

export const enum Keys {
  NONE  = -1,
  KEY_0 = 0x0,
  KEY_1 = 0x1,
  KEY_2 = 0x2,
  KEY_3 = 0x3,
  KEY_4 = 0x4,
  KEY_5 = 0x5,
  KEY_6 = 0x6,
  KEY_7 = 0x7,
  KEY_8 = 0x8,
  KEY_9 = 0x9,
  KEY_A = 0xA,
  KEY_B = 0xB,
  KEY_C = 0xC,
  KEY_D = 0xD,
  KEY_E = 0xE,
  KEY_F = 0xF,
}

export default function keyFor(keyCode: number): Keys {
  switch (keyCode) {
    case KeyCodes.KEY_X: return Keys.KEY_0;
    case KeyCodes.KEY_1: return Keys.KEY_1;
    case KeyCodes.KEY_2: return Keys.KEY_2;
    case KeyCodes.KEY_3: return Keys.KEY_3;
    case KeyCodes.KEY_Q: return Keys.KEY_4;
    case KeyCodes.KEY_W: return Keys.KEY_5;
    case KeyCodes.KEY_E: return Keys.KEY_6;
    case KeyCodes.KEY_A: return Keys.KEY_7;
    case KeyCodes.KEY_S: return Keys.KEY_8;
    case KeyCodes.KEY_D: return Keys.KEY_9;
    case KeyCodes.KEY_Z: return Keys.KEY_A;
    case KeyCodes.KEY_C: return Keys.KEY_B;
    case KeyCodes.KEY_4: return Keys.KEY_C;
    case KeyCodes.KEY_R: return Keys.KEY_D;
    case KeyCodes.KEY_F: return Keys.KEY_E;
    case KeyCodes.KEY_V: return Keys.KEY_F;
    default: return Keys.NONE;
  }
}
