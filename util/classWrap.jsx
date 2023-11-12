
import React from 'react'

function classWrapFactory(Component, addClassName, addProps) {
    return function classWrap(props) {

        const {
            className,
            ...otherProps
        } = props

        const hasPropHandler = typeof addProps === 'function'

        const extraProps = hasPropHandler ? {} : addProps

        const newProps = {
            className: `${addClassName}${className && className.trim() ? ' ' + className : ''}`,
            ...otherProps,
            ...extraProps,
        }

        return React.createElement(Component, hasPropHandler ? addProps(newProps) : newProps)
    }
}

export { classWrapFactory as classWrap }
