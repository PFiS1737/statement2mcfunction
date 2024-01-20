import { topPrefix } from "../../config.js"
import { trimString, each, isNumberString } from "../util.js"

import { Commands } from "./Command/Main.js"
import { Scoreboard } from "./Command/Scoreboard.js"

import { ObjectiveInfo } from "./ObjectiveInfo.js"
import { VariableInfo } from "./VariableInfo.js"

import { VariableMap } from "./DataMap/VariableMap.js"
import { TemporaryVariableMap } from "./DataMap/TemporaryVariableMap.js"
import { intMap } from "./DataMap/IntegerMap.js"

import { OperationParser } from "./OperationParser.js"

import { banner } from "../banner.js"

export class FunctionFile {
    constructor({
        prefix = topPrefix,
        objective = "main",
        name = "index",
        path = "/"
    } = {}) {
        this.content = new Commands()
        
        this.objective = objective instanceof ObjectiveInfo
            ? objective
            : new ObjectiveInfo(prefix + "_" + objective)
        
        this.name = name
        this.path = path
        
        this.addedObjectives = []
        this.subFile = []
        
        this.varMap = new VariableMap(this)
        this.tempVarMap = new TemporaryVariableMap(this)
        // this.whileMap = new DataMapWhileBlock(this)
        // this.ifBlockMap = new DataMap({ prefix, objective: this._createSubObjectiveName("if") })
        // this.unlessBlockMap = new DataMap({ prefix, objective: this._createSubObjectiveName("unless") })
        
        this._commandScoreboardObjectivesAdd(this.objective)
    }
    get _fullPath() {
        return this.path + this.name
    }
    
    _whileTimer = 0
    
    eComment(type, value) {
        switch (type) {
            case "path": {
                const _value = value.split("/")
                this.name = _value.pop() || "index"
                this.path = _value.join("/") + "/"
                break
            }
            default: {
                // TODO throw new Error()
                break
            }
        }
        return this
    }
    eGet(varName, objectiveName, newName) {
        this.varMap.set(newName ?? varName, new VariableInfo({
            _name: newName ?? varName,
            _supplied: true,
            target: varName,
            objective: objectiveName ?? this.objective
        }))
        return this
    }
    eLet(varName, assignmentOperator, expression) {
        this._newVar(varName)
        return this.eAssignment(varName, assignmentOperator, expression)
    }
    eAssignment(varName, assignmentOperator, expression) {
        if (!([ "=", "+=", "-=", "*=", "/=", "%=" ].includes(assignmentOperator))) throw new Error()
        if ((/^[_$0-9a-zA-Z]+$/).test(expression)) this._commandScoreboardPlayersOperation(
            this._getVar(varName),
            assignmentOperator,
            this._getVar(expression)
        )
        else {
            this._commandScoreboardPlayersOperation(
                this._getVar(varName),
                assignmentOperator,
                this._eOperation(expression)
            )
        }
        return this
    }
    eStore(varName, objectiveName, newName) {
        this._commandScoreboardPlayersOperation(
            new VariableInfo({
                _supplied: true,
                target: newName ?? varName,
                objective: objectiveName ?? this.objective
            }),
            "=",
            this._getVar(varName)
        )
        return this
    }
    eRun(command) {
        this.content.push(command)
        return this
    }
    eLog(varName, lineNumber) {
        const varInfo = this._getVar(varName)
        this.eRun(
            "tellraw @s " +
            JSON.stringify({
                rawtext: [
                    {
                        text: `${varName}: `
                    },
                    {
                        score: {
                            name: varInfo.targetHash,
                            objective: varInfo.objective.hash
                        }
                    },
                    {
                        text: `(line: ${lineNumber})`
                    }
                ]
            })
        )
        return this
    }
    eWhile(condition) {
        const name = `while_${this._whileTimer++}`
        
        const subFile = new SubFunctionFileWhile({
            prefix: this.objective.name,
            objective: this._createSubObjective(name)
        }, this)
    }
    // eIf() {
    //     return this._createSubFile(`if_${this.ifBlockMap.size}`)
    // }
    // eUnless() {
    //     return this._createSubFile(`unless_${this.unlessBlockMap.size}`)
    // }
    _eOperation(expression) {
        const parser = new OperationParser(expression, this.tempVarMap)
        each(parser, result => {
            const {
                _tempVarInfo: tempVarInfo,
                target,
                operator: arithmeticOperator,
                source
            } = result
            
            switch (arithmeticOperator) {
                case "+":
                case "-":
                case "*":
                case "/":
                case "%": {
                    if (!OperationParser.validityCheck(target, source)) throw new Error()
                    this._commandScoreboardPlayersOperation(
                        tempVarInfo,
                        "=",
                        this._getVar(target)
                    )._commandScoreboardPlayersOperation(
                        tempVarInfo,
                        arithmeticOperator + "=",
                        this._getVar(source)
                    )
                    break
                }
                /* case ">":
                case "<": {
                    this._commandScoreboardPlayersOperation(
                        tempVarInfo,
                        "=",
                        this._getVar(target)
                    )._commandScoreboardPlayersOperation(
                        tempVarInfo,
                        arithmeticOperator,
                        this._getVar(source)
                    )
                    break
                } */
                case "**": {
                    if (!OperationParser.validityCheck(target, source)) throw new Error()
                    if (!isNumberString(source)) throw new Error()
                    let power = Number(source) - 1
                    this._commandScoreboardPlayersOperation(
                        tempVarInfo,
                        "=",
                        this._getVar(target)
                    )
                    while (power--) {
                        this._commandScoreboardPlayersOperation(
                            tempVarInfo,
                            "*=",
                            this._getVar(target)
                        )
                    }
                    break
                }
                case "++":
                case "--": {
                    if (!OperationParser.validityCheck(target, source, { selfMode: true })) throw new Error()
                    if (target && !source) {
                        this._commandScoreboardPlayersOperation(
                            tempVarInfo,
                            "=",
                            this._getVar(target)
                        )._commandScoreboardPlayersOperation(
                            this._getVar(target),
                            `${arithmeticOperator[0]}=`,
                            this._getInt("1")
                        )
                    } else if (!target && source) {
                        this._commandScoreboardPlayersOperation(
                            this._getVar(source),
                            `${arithmeticOperator[0]}=`,
                            this._getInt("1")
                        )._commandScoreboardPlayersOperation(
                            tempVarInfo,
                            "=",
                            this._getVar(source)
                        )
                    }
                    break
                }
                default: {
                    throw new Error()
                }
            }
        })
        return this.tempVarMap.lastTempVarInfo
    }
    _eCondition(expression) {
        
    }
    
    _newVar(varName) {
        if (this.varMap.has(varName)) throw new Error()
        return this.varMap.set(varName)
    }
    _getVar(varName) {  console.log({varName})
        if (isNumberString(varName)) return this._getInt(varName)
        if (/__temporary_variable_([0-9]+)__/.test(varName)) return this.tempVarMap.get(varName)
        if (!this.varMap.has(varName)) throw new Error()
        return this.varMap.get(varName)
    }
    _getInt(intStr) {
        if (!intMap.has(intStr)) {
            intMap.set(intStr)
        }
        return intMap.get(intStr)
    }
    
    _createSubObjective(subName) {
        return new ObjectiveInfo(this.objective.name + "_" + subName)
    }
    
    _exportContent() {
        each(intMap.data, ([ num, varInfo ]) => {
            this._commandScoreboardPlayersSet(varInfo, num, "unshift")
        })
        this._commandScoreboardObjectivesAdd(intMap.objective, "unshift")
        this.content.unshift(banner(this._fullPath))
        
        each(this.addedObjectives, objective => {
            this._commandScoreboardObjectivesRemove(objective)
        })
        
        return this.content.join("\n")
    }
    
    _commandScoreboardObjectivesAdd(objective, method = "push") {
        this.addedObjectives.push(objective)
        this.content[method](Scoreboard.objectivesAdd(objective).raw)
        return this
    }
    _commandScoreboardObjectivesRemove(objective, method = "push") {
        this.content[method](Scoreboard.objectivesRemove(objective).raw)
        return this
    }
    _commandScoreboardPlayersSet(varInfo, score, method = "push") {
        this.content[method](Scoreboard.playersSet(varInfo, score).raw)
        return this
    }
    _commandScoreboardPlayersRemove(varInfo, score, method = "push") {
        this.content[method](Scoreboard.playersRemove(varInfo, score).raw)
        return this
    }
    _commandScoreboardPlayersAdd(varInfo, score, method = "push") {
        this.content[method](Scoreboard.playersAdd(varInfo, score).raw)
        return this
    }
    _commandScoreboardPlayersReset(varInfo, method = "push") {
        this.content[method](Scoreboard.playersReset(varInfo).raw)
        return this
    }
    _commandScoreboardPlayersOperation(targetVarInfo, operator, sourceVarInfo, method = "push") {
        this.content[method](Scoreboard.playersOperation(targetVarInfo, operator, sourceVarInfo).raw)
        return this
    }
}

class SubFunctionFileWhile extends FunctionFile {
    constructor(opt) {
        super(opt)
        this.parentFile = opt.parent
        this.varMap.extends(opt.parent.varMap)
        // this.whileMap.extends(parent.whileMap)
    }
    end() {
        // 
        return this.parentFile
    }
}
