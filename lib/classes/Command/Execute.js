import { UnfinishedCommand } from "./Main.js"

export class Execute {
    constructor() {}
    
    static ifScore(targetVarInfo, operator, sourceVarInfo) {
        return new UnfinishedCommand()
    }
    static unlessScore(targetVarInfo, operator, sourceVarInfo) {
        return new UnfinishedCommand()
    }
}