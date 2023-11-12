
export function resetStateOnPropsChange(...propsToStore) {
    return function(resetterFunc) {
        return function getDerivedStateFromProps(nextProps, prevState) {

            if (propsToStore.every(p => nextProps[p] === prevState[p]))
                return null

            const newState = propsToStore.reduce((obj, p) => {
                obj[p] = nextProps[p]
                return obj
            }, {})

            return {
                ...newState,
                ...resetterFunc(nextProps, prevState),
            }
        }
    }
}
