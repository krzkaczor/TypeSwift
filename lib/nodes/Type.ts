import * as ts from 'typescript'
import Swiftable from './Swiftable'

export default class Type implements Swiftable {
  private jsType: JsType

  constructor(public rawType: any) {
    this.jsType = toJsType(rawType.intrinsicName)
  }

  emitSwift(): string {
    switch (this.jsType) {
      case JsType.number: return 'Int'
      case JsType.string: return 'String'
      case JsType.boolean: return 'Bool'
    }
    throw new Error(`Unknown type ${this.jsType}`)
  }

  conversionFromJsCore(varName: string): string {
    switch (this.jsType) {
      case JsType.number: return `Int(${varName}.toInt32())`
      case JsType.string: return `${varName}.toString()`
      case JsType.boolean: return `${varName}.toBool()`
    }

    throw new Error(`Unknown type ${this.jsType}`)
  }
}

enum JsType {
  number,
  string,
  boolean
}

function toJsType(s: string): JsType {
  switch (s) {
    case 'number': return JsType.number;
    case 'string': return JsType.string;
    case 'boolean': return JsType.boolean;
  }
}