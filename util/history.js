
const stateKey = 'nextLocationState'

function getStorage() {
    return window.sessionStorage || window.localStorage
}

export function supportsHistory() {
    return !!(window.history && window.history.replaceState) // Old IE doesn't support History API
}

export function getLocationState(location) {

    if (supportsHistory())
        return location.state

    var storage = getStorage()
    var storedState

    try {
        var value = storage.getItem(stateKey)
        if (value)
            storedState = JSON.parse(value)
    } catch(ex) {
        storedState = void 0
    }

    storage.removeItem(stateKey)

    return storedState
}

export function storeLocationState(opt) {

    if (supportsHistory() || !opt || !opt.state)
        return

    var storage = getStorage()

    storage.setItem(stateKey, JSON.stringify(opt.state))

    delete opt.state
}
