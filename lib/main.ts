import * as fs from "fs"
import * as path from "path"
import * as fse from "fs-extra"

import SwiftDefinitionGenerator from './SwiftDefinitionGenerator'

const jsFilePath: string = process.argv[2]
const definitionsFilePath: string = process.argv[3]
const outputPath: string = process.argv[4]
console.log(`Bundle path: ${jsFilePath}`);
console.log(`Definitions path: ${definitionsFilePath}`);

const outputBundlePath = path.join(outputPath, 'bundle.js')
console.log(`Copying bundle to: ${outputBundlePath}`)
fse.copySync(jsFilePath, outputBundlePath);

console.log('Generating swift code...')
const definitionsFile = fs.readFileSync(definitionsFilePath).toString()
const generator = new SwiftDefinitionGenerator(definitionsFile)
const swiftFiles = generator.emitSwiftFiles()

swiftFiles.forEach(file => {
  const filePath = path.join(outputPath, `${file.name}.swift`);
  console.log(`Saving code to ${filePath}`)
  fs.writeFileSync(filePath, file.code);
})


