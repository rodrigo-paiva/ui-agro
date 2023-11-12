
import { getIntl } from './intl'

export default formatNumber

export function formatNumber(number, opt = {}) {
    const intl = getIntl()
    if (!intl)
        return number.toString()
    return intl.formatNumber(number, opt)
}
