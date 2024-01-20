import { DataMap } from "./Main.js"

export class TemporaryVariableMap extends DataMap {
    constructor(functionFile) {
        super("temporary_variable", functionFile)
    }
    
    timer = 0
    lastTempVarInfo
    
    genNew() {
        const tempVar = this.set(`__temporary_variable_${this.timer++}__`)
        this.lastTempVarInfo = tempVar
        return tempVar
    }
}
