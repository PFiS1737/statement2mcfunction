import md5 from "md5"

export class ObjectiveInfo {
    constructor(name, { _supplied } = {}) {
        this.name = name
        this._supplied = _supplied 
    }
    get hash() {
        if (this._supplied || process?.env?.NODE_ENV === "development") return this.name
        else return md5(this.name).slice(8, 24)
    }
}