
import React from 'react'
import ReactGA from 'react-ga'

import UrlMonitor from './UrlMonitor'

var analyticsInitialized = false
var lastPageUrl = null

function initAnalytics(googleAnalyticsId) {

    if (analyticsInitialized)
        return

    ReactGA.initialize(googleAnalyticsId, {
        titleCase: false,
    })

    analyticsInitialized = true
}

function registerPageView(googleAnalyticsId, pageUrl, avoidRepeatedUrl = false) {

    initAnalytics(googleAnalyticsId)

    if (avoidRepeatedUrl) {
        if (lastPageUrl === pageUrl)
            return
        lastPageUrl = pageUrl
    }

    ReactGA.pageview(pageUrl)

}

class Analytics extends React.PureComponent {

    onChange = state => {
        const { id } = this.props

        if (!state || !id)
            return

        registerPageView(id, `${state.pathname}${state.search}`, true)
    }

    render() {
        if (!this.props.id)
            return null
        return <UrlMonitor onChange={this.onChange} />
    }
}

export default Analytics
