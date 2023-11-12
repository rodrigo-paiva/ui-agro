
import 'font-awesome/scss/font-awesome.scss'

import React from 'react'

export default function Icon(props) {

    const {
        name,
        extra,
        className,
        stack,
        stackExtra,
        stackInvert,
        children,
        ...otherProps
    } = props

    let finalIconName = handleIconClassName(name, extra)

    if (stack) {

        let finalStackName = handleIconClassName(stack, stackExtra)

        let classNameWrap = `fa-stack ${className || ''}`
        let className2x = `fa ${finalStackName} ${stackInvert ? 'fa-stack-1x' : 'fa-stack-2x'}`
        let className1x = `fa ${finalIconName} ${stackInvert ? 'fa-stack-2x' : 'fa-stack-1x'}`

        return (
            <span className={classNameWrap} aria-hidden='true' {...otherProps}>
                <i className={className2x} />
                <i className={className1x}>{children}</i>
            </span>
        )
    }

    let mainClassName = `fa ${finalIconName} ${className || ''}`

    return <i className={mainClassName} aria-hidden='true' {...otherProps}>{children}</i>
}

function handleIconClassName(name, extra) {

    let modifiers

    if (typeof extra === 'string') {
        modifiers = extra.split(' ')
    } else if (Array.isArray(extra)) {
        modifiers = extra
    } else {
        modifiers = []
    }

    let finalIconName = `fa-${name}`

    finalIconName += modifiers
        .map(m => m.trim())
        .filter(m => m)
        .map(m => ` fa-${m}`)
        .join('')

    return finalIconName
}
