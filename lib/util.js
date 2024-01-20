export function each(target, callbackfn, thisArg) {
    if (Array.isArray(target)) target.forEach(callbackfn, thisArg)
    else if (target && target[Symbol.iterator]) for (let item of target) callbackfn.call(thisArg, item, target)
    else if (typeof target === "object") each(Object.keys(target), (key, i) => callbackfn.call(thisArg, target[key], key, i, target))
}

export function trimString(str) {
    return str.trim().replaceAll("    ", "")
}

export function isNumberString(str) {
    return !!str && !Number.isNaN(Number(str))
}
