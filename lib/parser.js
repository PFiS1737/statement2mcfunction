import { expressionType } from "./expressionType.js"

export function parser(expression, lineNumber) {
    if (expression.startsWith("#") && !expression.startsWith("#!")) return
    let result
    if (
        result = expression.match(/^\#\! ([^ ]+) ([^ ]+)$/)
    ) {
        return {
            type: expressionType.COMMENT,
            method: "eComment",
            args: [
                result[1],  // type
                result[2],  // value
            ]
        }
    } else if (
        ( result = expression.match(/^get ([^ ]+) from ([^ ]+)$/) ) ||
        ( result = expression.match(/^get ([^ ]+) as ([^ ]+) from ([^ ]+)$/) )
    ) {
        return {
            type: expressionType.GET,
            method: "eGet",
            args: [
                result[1],  // varName
                result[3] ? result[3] : result[2],  // objectiveName
                result[3] ? result[2] : null,  // newName
            ]
        }
    } else if (
        result = expression.match(/^let ([^ ]+) ([^ ]+) (.+)$/)
    ) {
        return {
            type: expressionType.LET,
            method: "eLet",
            args: [
                result[1],  // varName
                result[2],  // assignmentOperator
                result[3],  // expression
            ]
        }
    } else if (
        ( result = expression.match(/^store ([^ ]+) to ([^ ]+)$/) ) ||
        ( result = expression.match(/^store ([^ ]+) as ([^ ]+) to ([^ ]+)$/) )
    ) {
        return {
            type: expressionType.STORE,
            method: "eStore",
            args: [
                result[1],  // varName
                result[3] ? result[3] : result[2],  // objectiveName
                result[3] ? result[2] : null,  // newName
            ]
        }
    } else if (
        result = expression.match(/^run (.+)$/)
    ) {
        return {
            type: expressionType.RUN,
            method: "eRun",
            args: [
                result[1],  // command
            ]
        }
    } else if (
        result = expression.match(/^log (.+)$/)
    ) {
        return {
            type: expressionType.LOG,
            method: "eLog",
            args: [
                result[1],  // varName
                lineNumber,
            ]
        }
    } else if (
        result = expression.match(/^([^ ]+) ([^ ]+) (.+)$/)
    ) {
        return {
            type: expressionType.ASSIGNMENT,
            method: "eAssignment",
            args: [
                result[1],  // varName
                result[2],  // assignmentOperator
                result[3],  // expression
            ]
        }
    }
}