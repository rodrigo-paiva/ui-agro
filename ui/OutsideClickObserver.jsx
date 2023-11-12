
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class OutsideClickObserver extends Component {

    static propTypes = {
        action: PropTypes.func,
        element: PropTypes.node,
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside)
    }

    handleClickOutside = (e) => {
        if (this.ref && !this.ref.contains(e.target)) {

            const {
                action,
            } = this.props

            if (typeof action === 'function')
                action()
        }
    }

    setWrapperRef = (node) => {
        this.ref = node
    }

    render() {

        const {
            /* eslint-disable no-unused-vars */
            action,
            /* eslint-enable no-unused-vars */
            element = 'span',
            ...otherProps
        } = this.props

        var props = {
            ref: this.setWrapperRef,
            ...otherProps
        }

        return React.createElement(element, props)
    }

}
