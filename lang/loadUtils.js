
import isIntlLocaleSupported from 'intl-locales-supported'

import { detectLanguage, getLocales } from './index'

const loadedLanguages = {}
const languageLoadPromises = {}

function loadIntlPolyfill(locale) {

    if (window.Intl && isIntlLocaleSupported(locale)) {
        return Promise.resolve()
    }

    return import(/* webpackChunkName: "intl" */'intl')
}

function loadLocaleData(localeLoadFn) {

    if (!localeLoadFn)
        return Promise.resolve()

    return new Promise((resolve, reject) => {
        localeLoadFn()(resolve, reject)
    })
}

function loadAll(localeLoadFns = [], extraLoad = null) {

    var promises = localeLoadFns.map(fn => loadLocaleData(fn))

    if (Array.isArray(extraLoad)) {
        promises = promises.concat(extraLoad)
    } else if (extraLoad) {
        promises.push(extraLoad)
    }

    return Promise.all(promises)
}

export function loadLanguage(lang, extraLoad = null) {

    let language = detectLanguage(lang)

    let loadedLanguage = loadedLanguages[language]
    if (loadedLanguage)
        return Promise.resolve(loadedLanguage)

    let languageLoadPromise = languageLoadPromises[language]
    if (languageLoadPromise)
        return languageLoadPromise

    const locales = getLocales()
    const locale = locales[language]

    languageLoadPromises[language] = loadIntlPolyfill(language)
        .then(() => loadAll(locale.loaders, extraLoad))
        .then(([messages]) => {

            loadedLanguages[language] = {
                key: language,
                messages: messages,
            }

            return loadedLanguages[language]
        })

    return languageLoadPromises[language]
}
