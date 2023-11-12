
import { getIntl } from './intl'

const dateFormats = {
    monthDay: { day: '2-digit', month: '2-digit' },
    year: { year: 'numeric' },
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    fulltime: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
}

export default formatDate

export function formatDate(date, opt = {}) {
    const intl = getIntl()
    if (!intl)
        return date.toString()

    if (typeof opt === 'string' && dateFormats[opt])
        opt = dateFormats[opt]

    return intl.formatDate(date, opt)
}
