
export function loadImage(src) {

    var abort

    const wrappedPromise = new Promise((resolve, reject) => {

        abort = () => {
            if (imageElement) {
                imageElement.onload = null
                imageElement.onerror = null
            }
            if (!loaded) {
                reject({ isAborted: true })
            }
        }

        if (!src)
            reject(new Error('loadImage(): "src" parameter must be specified'))

        var loaded = false
        var imageElement = new Image()

        imageElement.onload = () => {
            loaded = true
            resolve(imageElement)
        }
        imageElement.onerror = reject
        imageElement.src = src

    })

    return {
        promise: wrappedPromise,
        abort: abort,
        then(a, b) {
            return this.promise.then(a, b)
        },
        catch(a, b) {
            return this.promise.catch(a, b)
        },
    }
}

export function getImageType(fileName) {

    if (/\.j((p(eg|e|g)|fif))$/.test(fileName))
        return 'image/jpeg'

    if (/\.png$/.test(fileName))
        return 'image/png'

    if (/\.gif$/.test(fileName))
        return 'image/gif'

    if (/\.bmp?$/.test(fileName))
        return 'image/bmp'

    if (/\.ico$/.test(fileName))
        return 'image/x-icon'

    if (/\.svg$/.test(fileName))
        return 'image/svg+xml'

    return ''
}
