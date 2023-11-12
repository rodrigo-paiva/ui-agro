
let finishRenderTimer
let loadCount = 0

function startRender() {
    clearTimeout(finishRenderTimer)
    window.prerenderReady = false
}

function execFinishRender() {
    window.prerenderReady = true
}

function finishRender() {
    clearTimeout(finishRenderTimer)
    finishRenderTimer = setTimeout(execFinishRender, 10)
}

export function increaseLoadCount() {
    if (loadCount === 0)
        startRender()
    loadCount++
}

export function decreaseLoadCount() {
    if (loadCount < 1)
        return
    loadCount--
    if (loadCount === 0)
        finishRender()
}

function checkForPrerenderBrowser() {
    if (!window.navigator || typeof window.navigator.userAgent !== 'string')
        return false
    return /prerender/ig.test(window.navigator.userAgent)
}

var isPrerenderBrowser

export function isPrerendering() {
    if (typeof isPrerenderBrowser !== 'boolean')
        isPrerenderBrowser = checkForPrerenderBrowser()
    return isPrerenderBrowser
}
