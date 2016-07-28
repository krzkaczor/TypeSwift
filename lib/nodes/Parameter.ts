import * as ts from "typescript"
import Swiftable from './Swiftable'
import Type from './Type'

export default class Parameter implements Swiftable {
  constructor(public name: string, public type: Type) {}

  emitSwift(): string {
    return `${this.name}: ${this.type.emitSwift()}?`
  }
}