import { topPrefix } from "../../../config.js"
import { ObjectiveInfo } from "../ObjectiveInfo.js"
import { VariableInfo } from "../VariableInfo.js"

export class DataMap {
    constructor(subName, functionFile) {
        this.subName = subName
        if (functionFile) {
            // this.prefix = functionFile.objective.name
            this.__functionFile = functionFile
            this.objective = functionFile._createSubObjective(subName)
            functionFile._commandScoreboardObjectivesAdd(this.objective)
        }
    }
    data = new Map()
    extends(dataMap) {
        this.data = dataMap.data
    }
    
    set(key, value) {
        if (value) this.data.set(key, value)
        else this.data.set(
            key,
            new VariableInfo({
                _name: key,
                target: topPrefix + "_" + key,
                objective: this.objective
            })
        )
        return this.get(key)
    }
    get(key) {
        return this.data.get(key)
    }
    has(key) {
        return this.data.has(key)
    }
    get size() {
        return this.data.size
    }
}

// export class DataMapWhile extends DataMap {
//     constructor(functionFile) {
//         super("while", functionFile)
//     }
// }
