import { each } from "../../util.js"

export class Commands extends Array {
    constructor() {
        super()
    }
    push(...commands) {
        each(commands, command => {
            const last = this[this.length - 1]
            if (last instanceof UnfinishedCommand) this[this.length - 1] = last.chain(command)
            else super.push(command)
        })
    }
    unshift(...commands) {  // TODO 警告：该方法与 Array.prototype.unshift(...items) 行为不一致
        each(commands, command => {
            const first = this[0]
            if (first instanceof UnfinishedCommand) this[0] = first.chain(command)
            else super.unshift(command)
        })
    }
}

export class Command {
    constructor(commandRaw) {
        this.raw = commandRaw
    }
}

export class UnfinishedCommand extends Command {
    constructor(unfinishedCommand) {
        super(unfinishedCommand)
    }
    
    chain(command) {
        this.raw += command.raw
        if (command instanceof UnfinishedCommand) return this
        else if (command instanceof Command) return new Command(this.raw)
    }
}