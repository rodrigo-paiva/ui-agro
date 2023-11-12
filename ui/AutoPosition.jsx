
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getElementX, getElementRightX, isOncreenX, getElementY, getElementBottomY, isOncreenY } from '../util/element'

export default class AutoPosition extends Component {

    static propTypes = {
        element: PropTypes.node,
        className: PropTypes.string,
        positionClassNames: PropTypes.shape({
            main: PropTypes.string,
            top: PropTypes.string,
            bottom: PropTypes.string,
            left: PropTypes.string,
            right: PropTypes.string,
            centerX: PropTypes.string,
            centerY: PropTypes.string,
        }),
        x: PropTypes.oneOf(['before', 'center', 'after', 'left', 'right']),
        y: PropTypes.oneOf(['before', 'center', 'after', 'top', 'bottom']),
        allowXCenter: PropTypes.bool,
        allowYCenter: PropTypes.bool,
        maxPositionUpdateTries: PropTypes.number,
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (prevState.wantedX === nextProps.x &&
            prevState.wantedY === nextProps.y &&
            prevState.wantedAllowXCenter === nextProps.allowXCenter &&
            prevState.wantedAllowYCenter === nextProps.allowYCenter)
            return null

        var {
            x,
            y,
        } = nextProps

        if (x === 'left')
            x = 'before'
        else if (x === 'right')
            x = 'after'

        if (y === 'top')
            y = 'before'
        else if (y === 'bottom')
            y = 'after'

        return {
            wantedX: nextProps.x,
            wantedY: nextProps.y,
            wantedAllowXCenter: nextProps.allowXCenter,
            wantedAllowYCenter: nextProps.allowYCenter,
            x: x || 'after',
            y: y || 'after',
            allowXCenter: nextProps.allowXCenter || false,
            allowYCenter: nextProps.allowYCenter || false,
            positionUpdateCount: 0,
        }
    }

    state = {}

    container = null

    componentDidMount() {
        this.updatePosition()
    }

    componentDidUpdate() {
        this.updatePosition()
    }

    render() {

        const {
            element = 'span',
            /* eslint-disable no-unused-vars */
            positionClassNames,
            className,
            x,
            y,
            allowXCenter,
            allowYCenter,
            maxPositionUpdateTries,
            /* eslint-enable no-unused-vars */
            ...otherProps
        } = this.props

        const props = {
            ref: this.receiveRef,
            className: this.getClassName(),
            ...otherProps
        }

        return React.createElement(element, props)
    }

    getClassName() {

        const {
            positionClassNames = {},
            className,
        } = this.props

        const {
            x,
            y,
        } = this.state

        var xClass
        if (x === 'before')
            xClass = 'left'
        else if (x === 'center')
            xClass = 'centerX'
        else if (x === 'after')
            xClass = 'right'

        var yClass
        if (y === 'before')
            yClass = 'top'
        else if (y === 'center')
            yClass = 'centerY'
        else if (y === 'after')
            yClass = 'bottom'

        return `${positionClassNames.main || ''} ${positionClassNames[xClass] || '' } ${positionClassNames[yClass] || '' } ${className || ''}`
    }

    receiveRef = (ref) => {
        this.container = ref
    }

    updatePosition() {

        if (!this.container)
            return

        const {
            maxPositionUpdateTries = 3,
        } = this.props

        if (this.state.positionUpdateCount >= maxPositionUpdateTries)
            return

        const containerX = getElementX(this.container)
        const containerRightX = getElementRightX(this.container, containerX)
        const containerY = getElementY(this.container)
        const containerBottomY = getElementBottomY(this.container, containerY)

        var {
            x,
            y,
            allowXCenter,
            allowYCenter,
        } = this.state

        x = getPosition(x, allowXCenter, isOncreenX, containerX, containerRightX)
        y = getPosition(y, allowYCenter, isOncreenY, containerY, containerBottomY)

        if (x !== this.state.x || y !== this.state.y) {
            this.setState(state => ({
                x,
                y,
                positionUpdateCount: state.positionUpdateCount + 1
            }))
        }

    }

}

function getPosition(current, allowCenter, isOncreen, startPos, endPos) {

    if (current === 'before') {
        if (isOncreen(startPos))
            return current
        return allowCenter ? 'center' : 'after'
    }

    if (current === 'center') {
        // this assumes the center positiong is made with a CSS transform (translate 50% on desired axis)
        const posOffset = (endPos - startPos) / 2
        if (!isOncreen(endPos - 1 - posOffset))
            return 'before'
        if (!isOncreen(startPos - posOffset))
            return 'after'
        return current
    }

    if (current === 'after') {
        if (isOncreen(endPos - 1))
            return current
        return 'before'
    }

    return current
}
