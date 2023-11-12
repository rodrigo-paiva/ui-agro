
if (typeof document !== 'undefined') {
    document.addEventListener('click', onEvent.bind(null, 'click'), true)
    document.addEventListener('keydown', onEvent.bind(null, 'keydown'))
    document.addEventListener('keyup', onEvent.bind(null, 'keyup'))
}

let handlerLists = {}

function getHandlerList(type) {
    if (typeof handlerLists[type] === 'undefined')
        handlerLists[type] = []
    return handlerLists[type]
}

function getLastHandler(type) {

    const handlerList = getHandlerList(type)

    let handler
    let i = handlerList.length

    while (i-- && !handler) {
        handler = handlerList[i]
    }

    return handler || (() => {})
}

function removeHandlerFromList(handlerList, index) {
    if (index === handlerList.length - 1)
        handlerList.pop()
    else
        handlerList[index] = null
}

function onEvent(type, event) {
    const handler = getLastHandler(type)
    if (typeof handler === 'function')
        handler(event)
}

const EventStack = {

    addHandler(type, handler) {

        const handlerList = getHandlerList(type)
        handlerList.push(handler)

        // returns an object that can be used as a token to remove the passed handler
        return {
            type: type,
            index: handlerList.length - 1
        }
    },

    removeHandlers(list) {
        for (let i = 0, l = list.length; i < l; i++) {
            this.removeHandler(list[i])
        }
    },

    removeHandler(type, handler) {

        if (typeof type === 'object') {
            if (type.isRemoved) { // ensuring we don't use event tokens already used for removal
                return
            } else {
                type.isRemoved = true
                return this.removeHandlerByIndex(type.type, type.index)
            }
        }

        const handlerList = getHandlerList(type)
        const index = handlerList.indexOf(handler)

        removeHandlerFromList(handlerList, index)
    },

    removeHandlerByIndex(type, index) {

        if (typeof type === 'object')
            return this.removeHandlerByIndex(type.type, type.index)

        const handlerList = getHandlerList(type)
        removeHandlerFromList(handlerList, index)

    }

}

export default EventStack
