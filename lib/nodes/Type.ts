import * as ts from 'typescript'
import Swiftable from './Swiftable'

export default class Type implements Swiftable {
  constructor(public type: any) {}

  emitSwift(): string {
    return toSwiftType(this.type.intrinsicName)
  }
}

function toSwiftType(tsName: string): string {
  switch (tsName) {
    case 'number': return 'Int'
    default: throw new Error(`Unknown ts type - ${tsName}`)
  }
}