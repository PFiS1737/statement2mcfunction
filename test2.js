import { OperationParser } from "./lib/classes/OperationParser.js"

import { FunctionFile } from "./lib/classes/FunctionFile.js"
const file = new FunctionFile()

const parser = new OperationParser(
  `( ( ( a ) - ( b * c ) ) + ( d % e ) ) / ( f / ( g ++ ) )`,
  file.tempVarMap
)

for (const result of parser) {
  console.log(result)
}
