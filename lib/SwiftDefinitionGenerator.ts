import * as ts from "typescript";
import * as _ from "lodash"

export class SwiftFile {
  constructor(public name: string, public code: string) {}
}

export default class SwiftDefinitionGenerator {
  private declarations: Array<ts.Declaration>
  private definitionsSourceFile: ts.SourceFile

  constructor(private tsDef: string) {
    this.definitionsSourceFile = ts.createSourceFile('def', tsDef, ts.ScriptTarget.ES6, true);
    this.findDeclarations()
  }

  private findDeclarations() {
    this.declarations = []

    ts.forEachChild(this.definitionsSourceFile, (node: ts.Node) => {
      switch(node.kind) {
        case ts.SyntaxKind.FunctionDeclaration:
          const functionDeclaration = <ts.FunctionDeclaration>node;
          if (_.some(functionDeclaration.modifiers, modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
            this.declarations.push(functionDeclaration);
          }
          break;

        default:
          // console.trace(`Unrecognized node: ${node.kind}`);
      }
    });

    return exports
  }

  emitSwiftFiles(): Array<SwiftFile> {
    const ExampleContext = `import Foundation
import JavaScriptCore

struct ExampleContext {
    static var once = dispatch_once_t()

    private static let _defaultContext = JSContext()
    
    static let defaultContext = {
        () -> JSContext in
        dispatch_once(&once) {           
            ExampleContext._defaultContext.exceptionHandler = { context, exception in
                print("JS Error: \(exception)")
            }
            
            let fileURL = NSBundle.mainBundle().URLForResource("bundle", withExtension: "js")
            let bundle = try! String(contentsOfURL: fileURL!, encoding: NSUTF8StringEncoding)
            
            ExampleContext._defaultContext.evaluateScript(bundle)
        }
        return ExampleContext._defaultContext
    }
}`;


    let codeChunks = `import JavaScriptCore\n`

    codeChunks += this.declarations.map(decl => {
      switch (decl.kind) {
        case ts.SyntaxKind.FunctionDeclaration: return emitFunctionProxy(<ts.FunctionDeclaration>decl);
        default: throw new Error('Unrecognized node!')
      }
    }).join('\n')

    return [
      new SwiftFile('ExampleContext', ExampleContext),
      new SwiftFile('Bundle', codeChunks)
    ]
  }
}

type Parameter = [string, string]

function emitFunctionProxy(functionDeclaration: ts.FunctionDeclaration): string {
  const parameters = functionDeclaration.parameters.map((par: any) => {
    const parName = par.name.text; //@todo support binding pattern
    const type = par.type.getFullText()
    return [parName, toSwiftType(type)]
  })

  const resultType = toSwiftType(functionDeclaration.type.getFullText())

  const name = functionDeclaration.name.text

  return `public func ${name}(${parameters.map(p => `${p[0]}: ${p[1]}?`).join(', ')}) -> ${resultType}? {
    let fn = ExampleContext.defaultContext().objectForKeyedSubscript("${name}")
    
    let result = fn.callWithArguments([(${parameters.map(p => `${p[0]} ?? JSValue.init(nullInContext: ExampleContext.defaultContext()`).join(', ')}))!])
    
    if result.isUndefined || result.isNull {
        return nil
    }
    return ${resultType}(result.toInt32())
  }` //@todo toInt32
}

function isIdentifier(parameterName: ts.Identifier | ts.BindingPattern): parameterName is ts.Identifier {
  return true;
}

function toSwiftType(jsType: string): string {
  switch (jsType) {
    case 'number': return 'Int'
    default: throw new Error('Unknown type')
  }
}