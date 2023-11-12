
import equal from 'deep-equal'

export function clearUndefined(obj) {

    if (!obj || typeof obj !== 'object')
        return obj

    var newObj = {}

    Object.keys(obj).filter(k => typeof obj[k] !== 'undefined').forEach(k => {
        var v = obj[k]
        newObj[k] = typeof v === 'object' ? clearUndefined(v) : v
    })

    return newObj
}

export function isEqual(a, b, opt) {
    return equal(clearUndefined(a), clearUndefined(b), opt)
}

// copied from https://stackoverflow.com/a/40294058
export function deepClone(obj, hash = new WeakMap()) {

    if (Object(obj) !== obj) // primitives
        return obj
    if (hash.has(obj)) // cyclic reference
        return hash.get(obj)

    const result = obj instanceof Date ? new Date(obj)
        : obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
            : obj.constructor ? new obj.constructor()
                : Object.create(null)

    hash.set(obj, result)

    if (obj instanceof Map)
        Array.from(obj, ([key, val]) => result.set(key, deepClone(val, hash)))

    return Object.assign(result, ...Object.keys(obj).map(key => ({ [key]: deepClone(obj[key], hash) })))
}
