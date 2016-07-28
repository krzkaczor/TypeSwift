import * as ts from "typescript"
import Parameter from './Parameter'
import Swiftable from './Swiftable'
import Type from './Type'

export default class FunctionSignature implements Swiftable {
  constructor(public name: string, public parameters: Parameter[], public resultType: Type) {}

  emitSwift(): string {
    return `
public func ${this.name}(${this.parameters.map(p => p.emitSwift()).join(', ')}) -> ${this.resultType.emitSwift()}? {
  let fn = SharedTypeSwiftContext.sharedInstance.context.objectForKeyedSubscript("${this.name}")

  let result = fn.callWithArguments([(${this.parameters.map(p => `${p.name} ?? JSValue.init(nullInContext: SharedTypeSwiftContext.sharedInstance.context`).join(', ')}))!])

  if result.isUndefined || result.isNull {
    return nil
  }

  return ${this.resultType.conversionFromJsCore('result')}
}`
  }
}