
const supportPageOffset = window.pageXOffset !== undefined
const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat')

export function getElementX(el) {

    var xPos = el.offsetLeft
    var parentElement = el.offsetParent

    while (parentElement) {
        xPos += parentElement.offsetLeft
        parentElement = parentElement.offsetParent
    }

    return xPos
}

export function getElementY(el) {

    var yPos = el.offsetTop
    var parentElement = el.offsetParent

    while (parentElement) {
        yPos += parentElement.offsetTop
        parentElement = parentElement.offsetParent
    }

    return yPos
}

export function getElementRightX(el, elementX = getElementX(el)) {
    return elementX + el.offsetWidth
}

export function getElementBottomY(el, elementY = getElementY(el)) {
    return elementY + el.offsetHeight
}

export function isOncreenX(x) {
    const scrollX = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft
    return x >= scrollX && x <= scrollX + window.innerWidth
}

export function isOncreenY(y) {
    const scrollY = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop
    return y >= scrollY && y <= scrollY + window.innerHeight
}
