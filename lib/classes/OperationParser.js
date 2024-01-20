import { isNumberString } from "../util.js"

export class OperationParser {
    constructor(expression, tempVarMap) {
        this.expression = "(" + expression.replaceAll(" ", "") + ")"
        this.tempVarMap = tempVarMap
    }
    match() {
        const regular = /\( ?([^\(\)]+) ?\)/
        if (regular.test(this.expression)) {
            const [ singleExpComplete, singleExp ] = this.expression.match(regular)
            
            if (/^[_$0-9a-zA-Z]+$/.test(singleExp)) {
                this.expression = this.expression.replace(singleExpComplete, singleExp)
                return this.match()
            } else {
                const operators = [ "+", "-", "*", "/", "%", "**", "++", "--" ]
                for (const operator of operators) {
                    const result = singleExp.match(genRegExp(operator))
                    if (result) {
                        const tempVarInfo = this.tempVarMap.genNew()
                        this.expression = this.expression.replace(singleExpComplete, tempVarInfo._name)
                        return {
                            _tempVarInfo: tempVarInfo,
                            target: result[1],
                            operator,
                            source: result[2]
                        }
                    }
                }
                throw new Error()
            }
        }
    }
    
    static validityCheck(target, source, { selfMode = false } = {}) {
        if (selfMode) {
            if (
                ( target && !source && !isNumberString(target) ) ||
                ( source && !target && !isNumberString(source) )
            ) return true
            else return false
        } else {
            if (target && source) return true
            else return false
        }
    }
    
    *[Symbol.iterator]() {
        let result
        while (result = this.match()) {
            yield result
        }
    }
}

function genRegExp(operator) {
    return new RegExp(`^([_$0-9a-zA-Z]*)\\${operator.split("").join("\\")}([_$0-9a-zA-Z]*)$`)
}
