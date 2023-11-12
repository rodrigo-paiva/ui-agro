
import React from 'react'

export function createParagraph(text, className = '', element = 'p') {

    if (typeof text !== 'string')
        return null

    var props

    if (className) {
        props = {
            className
        }
    }

    return text.split('\n').filter(o => o.trim()).map((c, i) => React.createElement(element, { key: i, ...props }, c))
}

export function createLineBreak(text) {

    if (typeof text !== 'string')
        return null

    var arr = text.split('\n')

    for (var i = arr.length - 1; i > 0; i--) {
        arr.splice(i, 0, <br key={i} />)
    }

    return arr
}

export function clearLineBreaks(text) {

    if (typeof text !== 'string')
        return ''

    return text.replace(/[\n\r]/ig, ' ').replace(/( )+/ig, ' ')
}

export function removeHtml(text) {
    return text.replace(/<(?:.|\n)*?>/gm, '')
}
