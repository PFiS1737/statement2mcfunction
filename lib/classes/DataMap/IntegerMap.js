import { DataMap } from "./Main.js"

import { topPrefix } from "../../../config.js"
import { ObjectiveInfo } from "../ObjectiveInfo.js"

export class IntegerMap extends DataMap {
    constructor() {
        super("integer")
        // this.prefix = topPrefix
        this.objective = new ObjectiveInfo(topPrefix + "_integer")
    }
}
export const intMap = new IntegerMap()