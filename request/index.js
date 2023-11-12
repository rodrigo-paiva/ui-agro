
import request from 'superagent'

import makeAbortablePromise from '../util/makeAbortablePromise'

function clearObject(obj) {

    if (obj) {
        Object.keys(obj).forEach(prop => {
            if (typeof obj[prop] === 'undefined')
                delete obj[prop]
        })
    }

    return obj
}

function createRequest(url, method = 'get') {
    var type = (method || '').toLowerCase()

    if (type === 'get')
        return request.get(url)

    if (type === 'post')
        return request.post(url)

    if (type === 'put')
        return request.put(url)

    if (type === 'head')
        return request.head(url)

    return request.get(url)
}

export function fetch({ method, url, query, data, type, headers }) {

    var req = createRequest(url, method)
        .type(type)
        .query(clearObject(query || {}))
        .send(clearObject(data))

    if (headers)
        req = req.set(headers)

    var abortablePromise = makeAbortablePromise(req.then())
    var abort = abortablePromise.abort

    abortablePromise.request = req

    abortablePromise.abort = () => {
        if (req && req.abort)
            req.abort()
        if (abort)
            abort()
    }

    return abortablePromise
}

export function get(opt) {
    return fetch({
        ...opt,
        method: 'get',
    })
}

export function post(opt) {
    return fetch({
        ...opt,
        method: 'post',
    })
}

export function put(opt) {
    return fetch({
        ...opt,
        method: 'put',
    })
}

export function head(opt) {
    return fetch({
        ...opt,
        method: 'head',
    })
}

fetch.get = get
fetch.post = post
fetch.put = put
fetch.head = head
