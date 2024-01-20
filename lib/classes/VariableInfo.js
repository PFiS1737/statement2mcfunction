import md5 from "md5"
import { ObjectiveInfo } from "./ObjectiveInfo.js"

export class VariableInfo {
    constructor({ _name, _supplied, target, objective, supplied }) {
        this._name = _name
        this._supplied = _supplied
        this.target = target
        this.objective = objective instanceof ObjectiveInfo
            ? objective
            : new ObjectiveInfo(objective, { _supplied })
    }
    get targetHash() {
        if (this._supplied || process?.env?.NODE_ENV === "development") return this.target
        else return md5(this.target)
    }
}