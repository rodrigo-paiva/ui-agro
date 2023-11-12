
import React from 'react'
import PropTypes from 'prop-types'

class ScrollToMe extends React.Component {

    static contextTypes = {
        addScrollTarget: PropTypes.func,
        removeScrollTarget: PropTypes.func,
    }

    componentDidMount() {
        if (this.context.addScrollTarget)
            this.context.addScrollTarget(this)
        if (!this.props.avoidAutoScroll)
            this.scroll()
    }

    componentWillUnmount() {
        if (this.context.removeScrollTarget)
            this.context.removeScrollTarget(this)
    }

    componentDidUpdate() {
        if (!this.props.avoidAutoScroll)
            this.scroll()
    }

    receiveRootElement = (rootElement) => {
        this.rootElement = rootElement
    }

    scroll() {

        const { shouldScroll } = this.props

        if (typeof shouldScroll === 'function' && !shouldScroll())
            return

        this.forceScroll()

    }

    forceScroll() {

        if (!this.rootElement || !this.rootElement.scrollIntoView)
            return

        this.rootElement.scrollIntoView(true)

    }

    render() {

        const {
            element = 'div',
            avoidAutoScroll, // eslint-disable-line no-unused-vars
            shouldScroll, // eslint-disable-line no-unused-vars
            ...otherProps
        } = this.props

        otherProps.ref = this.receiveRootElement

        return React.createElement(element, otherProps)
    }

}

export default ScrollToMe
