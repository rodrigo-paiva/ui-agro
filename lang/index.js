
import { getIntl } from './intl'
import formatMessage from './formatMessage'
import formatDate from './formatDate'
import formatNumber from './formatNumber'

var defaultLang
var locales
var localeKeys

export default formatMessage

export { formatMessage, formatDate, formatNumber }

export const rawDateFormat = 'YYYY-MM-DD'

export function init(opt) {
    defaultLang = opt.defaultLang
    locales = opt.locales
    localeKeys = Object.keys(locales)
}

export function getLocales() {
    return locales
}

export function getLocaleKeys() {
    return localeKeys
}

export function detectUserLanguage() {
    // Different browsers have the user locale defined
    // on different fields on the `navigator` object, so we make sure to account
    // for these differences by checking all of them
    return (navigator.languages && navigator.languages[0]) ||
            navigator.language ||
            navigator.userLanguage
}

export function detectLanguage(langParam) {

    let language = (langParam || '').toLowerCase()

    if (!locales[language]) {

        language = getLocaleCode(language)

        if (!locales[language]) {

            // try to find a locale ignoring the region code
            let detectedLanguage = localeKeys.filter(key => getLocaleCode(key) === language)[0]

            // set to default language if needed
            language = detectedLanguage || defaultLang
        }
    }

    return language
}

export function getLang() {
    const intl = getIntl()
    if (!intl)
        return defaultLang
    return intl.locale
}

// example: from 'pt-BR' to 'pt'
export function getLocaleCode(langCode) {
    return (langCode || '').toLowerCase().split(/[_-]+/)[0]
}

export function getLangForOpenGraph(lang) {
    // Open Graph needs the culture formatted as 'pt_BR'
    return (lang || getLang()).split('-').map((part, i) => (i > 0 ? part.toUpperCase() : part)).join('_')
}
