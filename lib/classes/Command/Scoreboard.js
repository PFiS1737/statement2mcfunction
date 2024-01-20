import { Command } from "./Main.js"

export class Scoreboard {
    constructor() {}
    
    static objectivesAdd(objective) {
        return new Command(`scoreboard objectives add "${objective.hash}" dummy`)
    }
    static objectivesRemove(objective) {
        return new Command(`scoreboard objectives remove "${objective.hash}"`)
    }
    static playersSet(varInfo, score) {
        return new Command(`scoreboard players set "${varInfo.targetHash}" "${varInfo.objective.hash}" ${score}`)
    }
    static playersAdd(varInfo, score) {
        return new Command(`scoreboard players add "${varInfo.targetHash}" "${varInfo.objective.hash}" ${score}`)
    }
    static playersRemove(varInfo, score) {
        return new Command(`scoreboard players remove "${varInfo.targetHash}" "${varInfo.objective.hash}" ${score}`)
    }
    static playersReset(varInfo) {
        return new Command(`scoreboard players reset "${varInfo.targetHash}" "${varInfo.objective.hash}"`)
    }
    static playersOperation(targetVarInfo, operator, sourceVarInfo) {
        return new Command(`scoreboard players operation "${targetVarInfo.targetHash}" "${targetVarInfo.objective.hash}" ${operator} "${sourceVarInfo.targetHash}" "${sourceVarInfo.objective.hash}"`)
    }
}