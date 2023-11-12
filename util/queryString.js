
import queryString from 'query-string'

export default {

    stringify(queryObject) {
        return queryObject ? '?' + queryString.stringify(queryObject) : ''
    },

    parse(search) {
        return search ? queryString.parse(search) : {}
    },

}
