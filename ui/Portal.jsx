
import { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class Portal extends Component {

    static propTypes = {
        root: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.node,
        onPortalDidMount: PropTypes.func,
        onPortalWillUnmount: PropTypes.func,
    }

    static defaultProps = {
        root: document.body,
    }

    constructor(...args) {
        super(...args)

        this._target = document.createElement('div')
        if (this.props.className)
            this._target.className = this.props.className

    }

    componentDidMount() {

        const {
            root,
            onPortalDidMount,
        } = this.props

        root.appendChild(this._target)

        if (typeof onPortalDidMount === 'function')
            onPortalDidMount(this._target)

    }

    componentDidUpdate() {

        if (this._target && this.props.className)
            this._target.className = this.props.className

    }

    componentWillUnmount() {

        const {
            root,
            onPortalWillUnmount,
        } = this.props

        if (typeof onPortalWillUnmount === 'function')
            onPortalWillUnmount(this._target)

        root.removeChild(this._target)

        this._target = null

    }

    render() {
        return ReactDOM.createPortal(this.props.children, this._target)
    }

}
