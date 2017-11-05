import * as Binaryen from "binaryen";
import { IGraph, ISwitch } from "./types";

const ARG_CHAR = /[XYKN]/g;

interface IParentRef {
  id: string;
  key: string | number;
}

export class Builder {
  public graph: IGraph = Object.create(null);

  private parentMap: {
    [nodeId: string]: IParentRef;
  } = Object.create(null);

  constructor(public opcodePatterns: string[]) {
  }

  public buildGraph() {
    this.buildSwitchPaths();
    this.simplify();
    return this.graph;
  }

  private buildSwitchPaths() {
    const { graph, opcodePatterns, parentMap } = this;
    const switchPaths = opcodePatterns.map((opcodePattern) => {
      const switchPath = opcodePattern.replace(ARG_CHAR, "_");
      if (graph[switchPath] !== undefined) {
        throw new Error("graph is nondeterministic");
      }
      graph[switchPath] = opcodePattern;
      return switchPath;
    });
    switchPaths.sort();
    switchPaths.forEach((switchPath, i) => {
      const parent = this.buildSwitchPath(switchPath);
      this.parentMap[switchPath] = parent;
      // sort
      opcodePatterns[i] = graph[switchPath] as string;
    });
  }

  private buildSwitchPath(switchPath: string): IParentRef {
    const parentMap = this.parentMap;
    let id = "";
    let value;
    let parent;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < switchPath.length; i++) {
      const char = switchPath[i];
      value = id + char;
      let key: number | "default";
      if (char === "_") {
        key = "default";
      } else {
        key = parseInt(char, 16);
      }
      if (parent !== undefined) {
        parentMap[id] = parent;
      }
      this.addSwitchCase(id, key, value);
      parent = { id, key };
      id = value;
    }
    // will not be undefined if callId.length > 0
    return parent!;
  }

  private addSwitchCase(id: string, caseKey: number | "default", caseBlockId: string): void {
    let node = this.graph[id] as ISwitch;
    if (node === undefined) {
      node = this.graph[id] = {
        [caseKey]: caseBlockId,
      };
    } else if (node[caseKey] === undefined) {
      node[caseKey] = caseBlockId;
    } else if (node[caseKey] !== caseBlockId) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Error setting case ${caseKey} for switch block ${id} to ${caseBlockId} already set to ${node[caseKey]}`);
    }
  }

  private simplify() {
    const graph = this.graph;
    const parentMap = this.parentMap;
    for (const id of Object.keys(graph)) {
      const node = graph[id];
      if (typeof node !== "string") {
        const keys = Object.keys(node);
        if (keys.length === 1 && keys[0] === "default") {
          const parent = parentMap[id]!;
          const parentNode = graph[parent.id] as ISwitch;
          const defaultId = node.default!;
          parentNode[parent.key] = defaultId;
          parentMap[defaultId] = parent;
          delete graph[id];
        }
      }
    }
  }
}
