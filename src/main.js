import { each } from "../lib/util.js"
import { expressionType } from "../lib/expressionType.js"
import { parser } from "../lib/parser.js"
import { FunctionFile } from "../lib/classes/FunctionFile.js"

export default function(code) {
    let file = new FunctionFile()
    each(code.split("\n"), (expression, lineNumber) => {
        const result = parser(expression, lineNumber)
        
        console.log(result)
        
        if (result) file = file[result.method](...result.args)
        
    })
    
    return file
}