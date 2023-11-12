
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import queryString from '../util/queryString'
import { isEqual } from '../util/data'
import { supportsHistory } from '../util/history'

const listenWaitTime = 75
const syncAttemptWaitTime = 150
const syncMaxWaitTime = 1500

function createComparableObj(props) {
    return {
        pathname: props.location.pathname,
        query: queryString.parse(props.location.search),
    }
}

class ScrollManager extends React.Component {

    static childContextTypes = {
        addScrollTarget: PropTypes.func,
        removeScrollTarget: PropTypes.func,
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    scrollListenInterval = null
    scrollSyncInterval = null
    scrollSyncTimeout = null
    resetScroll = false
    hasScrolledA = false
    hasScrolledB = false
    scrollTargets = []

    getChildContext() {
        return {
            addScrollTarget: this.addScrollTarget,
            removeScrollTarget: this.removeScrollTarget
        }
    }

    addScrollTarget = element => {
        var index = this.scrollTargets.indexOf(element)
        if (index === -1)
            this.scrollTargets.push(element)
    }

    removeScrollTarget = element => {
        var index = this.scrollTargets.indexOf(element)
        if (index > -1)
            this.scrollTargets.splice(index, 1)
    }

    componentDidMount() {
        this.listenScroll()
        this.onPop(this.props)
    }

    componentWillUnmount() {
        this.unlistenScroll()
    }

    componentDidUpdate() {
        switch (this.props.history.action) {
        case 'PUSH':
            this.onPush()
            break
        case 'POP':
            this.onPop(this.props)
            break
        case 'REPLACE':
            break
        default:
            //console.warn(`Unrecognized location change action! "${this.props.history.action}"`)
            break
        }
    }

    shouldComponentUpdate(nextProps) {
        return !isEqual(createComparableObj(this.props), createComparableObj(nextProps), { strict: true })
    }

    listenScroll() {
        window.addEventListener('scroll', this.setScrollHappened, { passive: true })
        this.scrollListenInterval = setInterval(this.onScroll, listenWaitTime)
    }

    unlistenScroll() {
        window.removeEventListener('scroll', this.setScrollHappened, { passive: true })
        clearInterval(this.scrollListenInterval)
        this.hasScrolledA = false
        this.hasScrolledB = false
    }

    setScrollHappened = () => {
        this.hasScrolledA = true
        this.hasScrolledB = true
    }

    onScroll = () => {

        if (this.resetScroll) {
            this.resetScroll = false
            window.scrollTo(0, 0)
            return
        }

        if (!this.hasScrolledB) {
            return
        }

        if (this.hasScrolledA) {
            this.hasScrolledA = false
            return
        }

        this.hasScrolledB = false

        if (!supportsHistory()) {
            return
        }

        // record and store location
        const { pageXOffset: x, pageYOffset: y } = window
        const {
            location,
            history,
        } = this.props

        const { pathname, search, state = {} } = location

        if (!state.scroll || state.scroll.x !== pageXOffset || state.scroll.y !== pageYOffset) {
            history.replace(pathname + search, { ...state, scroll: { x, y } })
        }

    }

    onPush() {

        this.clearTimers()

        if (this.scrollTargets.length > 0)
            return

        this.resetScroll = true

    }

    onPop(props) {

        this.clearTimers()

        if (this.scrollTargets.length > 0)
            return

        if (!supportsHistory()) {
            this.resetScroll = true
            return
        }

        this.currentPropsForPop = props

        this.scrollSyncInterval = setInterval(this.tryScrollSync, syncAttemptWaitTime)
        this.scrollSyncTimeout = setTimeout(this.clearTimers, syncMaxWaitTime)

    }

    tryScrollSync = () => {
        // attempt location restore
        const { location: { state = {} } } = this.currentPropsForPop
        const { x, y } = state.scroll || {}

        const { pageXOffset, pageYOffset } = window
        if (x !== pageXOffset || y !== pageYOffset) {
            window.scrollTo(x, y)
        } else {
            this.clearTimers()
        }
    }

    clearTimers = () => {

        clearInterval(this.scrollSyncInterval)
        this.scrollSyncInterval = null

        clearTimeout(this.scrollSyncTimeout)
        this.scrollSyncTimeout = null

    }

    render() {
        return this.props.children
    }

}

export default withRouter(ScrollManager)
