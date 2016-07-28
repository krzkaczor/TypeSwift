import * as fs from "fs";

export default class SwiftFile {
  constructor(public name: string, public code: string) {}

  static fromFile(name: string, path: string): SwiftFile {
    return new SwiftFile(name, fs.readFileSync(path).toString())
  }
}
