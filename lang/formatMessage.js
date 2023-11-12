
import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { getIntl } from './intl'

class KeyWrapper extends PureComponent {
    render() {
        return this.props.children
    }
}

export default formatMessage

export function formatMessage(key, values, opt = {}) {
    if (!key)
        return ''
    const intl = getIntl()
    if (!intl)
        return key

    const finalOpt = Object.assign({ id: key }, opt)

    if (values) {
        let hasElements = false
        let newValues = {}

        Object.keys(values).forEach(v => {

            let element = values[v]
            if (typeof element !== 'object')
                return

            hasElements = true

            if (React.isValidElement(element) && !element.key) {
                newValues[v] = <KeyWrapper key={`l_${key}_${v}`}>{element}</KeyWrapper>
            } else {
                newValues[v] = element
            }

        })

        if (hasElements)
            return <FormattedMessage {...finalOpt} values={newValues} />
    }

    return intl.formatMessage(finalOpt, values)
}
