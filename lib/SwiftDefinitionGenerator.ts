import * as ts from "typescript";
import SwiftFile from './SwiftFile'
import FunctionSignature from './nodes/FunctionSignature'
import Parameter from './nodes/Parameter'
import Type from './nodes/Type'
import Swiftable from './nodes/Swiftable'

export default class SwiftDefinitionGenerator {
  private declarations: Swiftable[]
  private program: ts.Program
  private typeChecker: ts.TypeChecker

  constructor(private tsDef: string) {
    this.program = ts.createProgram(['/Users/kkaczor/Workspace/TypeSwift/example/dist/Greeter.d.ts'], {target: ts.ScriptTarget.ES5})
    this.typeChecker = this.program.getTypeChecker()
    this.findDeclarations()
  }

  private findDeclarations() {
    this.declarations = []

    this.program.getSourceFiles().forEach((file: ts.SourceFile) => {
      //skip basic js declarations
      if (file.fileName.indexOf('typescript/lib/lib.d.ts') !== -1) {
        return;
      }

      ts.forEachChild(file, (node: ts.Node) => {
        switch(node.kind) {
          case ts.SyntaxKind.FunctionDeclaration:
            const functionDeclaration = <ts.FunctionDeclaration>node;

            const name = functionDeclaration.name.text;

            const parameters = functionDeclaration.parameters.map((par: any) => {
              const name = par.name.text; //@todo support binding pattern
              const type = this.typeChecker.getTypeAtLocation(par.type) //this seems not to work at all
              return new Parameter(name, new Type(type))
            })

            const resultType = this.typeChecker.getTypeAtLocation(functionDeclaration.type)

            this.declarations.push(new FunctionSignature(name, parameters, new Type(resultType)));
            break;

          default:
            // console.trace(`Unrecognized node: ${node.kind}`);
        }
      })

    })
    return exports
  }

  emitSwiftFiles(): Array<SwiftFile> {
    let sharedContext = SwiftFile.fromFile('SharedTypeSwiftContext', './runtime/SharedTypeSwiftContext.swift')

    let codeChunks = `import JavaScriptCore\n`

    codeChunks += this.declarations.map(decl => decl.emitSwift()).join('\n')

    return [
      sharedContext,
      new SwiftFile('Bundle', codeChunks)
    ]
  }
}