
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

class UrlMonitor extends React.PureComponent {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)

        props.onChange(props && props.location ? props.location : null)
    }

    componentDidMount() {
        if (this.props.history && typeof this.props.history.listen === 'function')
            this.unlistenHistory = this.props.history.listen(this.props.onChange)
        else
            throw new Error('History listen function not available!')
    }

    componentWillUnmount() {
        if (typeof this.unlistenHistory === 'function')
            this.unlistenHistory()
        this.unlistenHistory = null
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        return null
    }

}

export default withRouter(UrlMonitor)
