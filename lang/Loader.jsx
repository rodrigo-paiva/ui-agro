
import React from 'react'
import PropTypes from 'prop-types'
import { IntlProvider, injectIntl } from 'react-intl'

import { storeIntlReference } from './intl'
import { loadLanguage } from './loadUtils'

class LanguageLoader extends React.Component {

    static propTypes = {
        language: PropTypes.string,
        extraLoad: PropTypes.any,
    }

    state = {
        loading: false,
        loaded: false,
    }

    componentDidMount() {
        this.loadLanguage(this.props.language)
    }

    componentWillUnmount() {
        this._isUnmounted = true
    }

    componentDidUpdate(prevProps) {
        if (this.props.language !== prevProps.language) {
            this.language = null
            this.loadLanguage(this.props.language)
        }
    }

    loadLanguage(language) {

        if (this.state.loading)
            return

        this.setState({
            loading: true,
            loaded: false
        })

        loadLanguage(language, this.props.extraLoad)
            .then(locale => {
                if (this._isUnmounted)
                    return
                this.setState({
                    loading: false,
                    loaded: true,
                    language: locale.key,
                    messages: locale.messages,
                })
            })
            .catch(error => {
                if (error.isAborted || this._isUnmounted)
                    return
                this.setState({
                    loading: false,
                    loaded: true,
                    language: language,
                    messages: {},
                    error: error,
                })
            })
    }

    render() {

        const {
            loading,
            loaded,
            language,
            messages,
        } = this.state

        if (loading || !loaded)
            return null

        return (
            <IntlProvider locale={language} messages={messages}>
                <IntlStore>
                    {this.props.children}
                </IntlStore>
            </IntlProvider>
        )
    }

}

const IntlReceiver = ({ intl, children }) => {

    storeIntlReference(intl)

    return children
}

const IntlStore = injectIntl(IntlReceiver)

export default LanguageLoader
