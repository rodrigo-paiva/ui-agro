
import { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const portalRoot = document.body

export default class Portal extends Component {

    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.node,
        onPortalDidMount: PropTypes.func,
        onPortalWillUnmount: PropTypes.func,
    }

    constructor(props) {
        super(props)

        this._target = document.createElement('div')
        if (this.props.className)
            this._target.className = this.props.className

    }

    componentDidMount() {

        portalRoot.appendChild(this._target)

        if (typeof this.props.onPortalDidMount === 'function')
            this.props.onPortalDidMount(this._target)

    }

    componentDidUpdate() {

        if (this._target && this.props.className)
            this._target.className = this.props.className

    }

    componentWillUnmount() {

        if (typeof this.props.onPortallWillUnmount === 'function')
            this.props.onPortalWillUnmount(this._target)

        portalRoot.removeChild(this._target)

        this._target = null

    }

    render() {
        return ReactDOM.createPortal(this.props.children, this._target)
    }

}
