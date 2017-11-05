export interface IGraph {
  [id: string]: ISwitch | string;
}

export interface ISwitch {
  [caseName: string]: string;
}
