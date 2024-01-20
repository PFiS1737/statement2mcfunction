// import { FunctionFile } from "./lib/classes/FunctionFile.js"

// console.log("Env:", process?.env?.NODE_ENV, "\n")

// const mcf = new FunctionFile({
//     // objective: "obj",
//     name: "main",
//     path: "/test"
// })

// // mcf.eGet("a", "test1")
// //     .eGet("b", "test2")
// //     .eGet("c")
// //     .eGet("d")
// //     .eGet("e")
// //     .eGet("f")
// //     .eVar("v1", "12" )
// //     .eVar("v2", "a" )
// //     .eRun("say \"Hello, World!\"")
// //     .eLog("b", "6")
// //     .eLog("v2", "7")
// //     .eStore("b", "output")
// //     .eStore("v1")
// //     .eStore("v2", "output_v", "v2_output")
// //     .eRun("==================")

// mcf.eGet("a", "test")
//     .eGet("b", "test")
//     .eGet("c", "test")
//     .eGet("d", "test")
//     .eGet("e", "test")
//     .eGet("f", "test")
    
//     .eLet("v", "=", "((a-(b*c))+(d%e))/f")
//     .eAssignment("v", "+=", "(a ** 4)+b")
//     // .eAssignment("v", "+=", "a+b")
    
//     .eStore("v", "test")

// console.log(mcf._exportContent())
// // console.log(mcf.varMap.get("v2"))

import main from "./src/main.js"

console.log("Env:", process?.env?.NODE_ENV, "\n")

console.log(main(`

get a from test
get b from test
get c from test
get d from test
get e from test
get f from test
get g from test
get h from test

run say =================

let v = ( ( a - ( b * c ) ) + ( d % e ) ) / ( f / ( g ++ ) )

# let v = ++a

# v += ( a ** 4 ) + b

run say =================

log v

store v as result to test

`)._exportContent())