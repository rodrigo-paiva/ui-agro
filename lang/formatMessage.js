
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { getIntl } from './intl'

class KeyWrapper extends PureComponent {
    render() {
        return this.props.children
    }
}

function isReactElement(element) {
    return typeof element === 'object' && React.isValidElement(element)
}

export default function formatMessage(key, values, opt = {}) {
    if (!key)
        return ''

    const intl = getIntl()
    if (!intl)
        return key

    const finalOpt = Object.assign({ id: key }, opt)

    if (values) {

        let hasElements = Object
            .values(values)
            .some(isReactElement)

        if (hasElements) {
            let newValues = Array.isArray(values) ? [] : {}

            Object.keys(values).forEach(v => {

                if (isReactElement(element) && !element.key) {
                    newValues[v] = <KeyWrapper key={`l_${key}_${v}`}>{element}</KeyWrapper>
                } else {
                    newValues[v] = element
                }

            })

            return <FormattedMessage {...finalOpt} values={newValues} />
        }
    }

    return intl.formatMessage(finalOpt, values)
}
