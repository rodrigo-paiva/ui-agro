
const makeAbortablePromise = promise => {
    let hasAborted = false

    const wrappedPromise = new Promise((resolve, reject) => {

        promise.then(val => hasAborted ? reject({ isAborted: true }) : resolve(val))

        promise.catch(error => hasAborted ? reject({ isAborted: true }) : reject(error))

    })

    return {
        promise: wrappedPromise,
        abort() {
            hasAborted = true
        },
        then(a, b) {
            return this.promise.then(a, b)
        },
        catch(a, b) {
            return this.promise.catch(a, b)
        },
    }
}

export default makeAbortablePromise
