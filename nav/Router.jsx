
import React from 'react'
import PropTypes from 'prop-types'
import BrowserRouter from 'react-router-dom/BrowserRouter'

import ScrollManager from './ScrollManager'

import { storeLocationState } from '../util/history'

var routerRef

function getRouter() {
    return routerRef
}

function navigate(...opt) {
    storeLocationState(...opt)
    return routerRef.history.push(...opt)
}

function listen(...opt) {
    return routerRef.history.listen(...opt)
}

const RouterReceiver = ({ children }, { router }) => {

    routerRef = router

    return children
}

RouterReceiver.contextTypes = {
    router: PropTypes.object.isRequired,
}

const Router = props => {

    const {
        children,
        handleScroll,
        ...otherProps
    } = props

    return (
        <BrowserRouter {...otherProps}>
            <RouterReceiver>
                {handleScroll ? <ScrollManager>{children}</ScrollManager> : children}
            </RouterReceiver>
        </BrowserRouter>
    )
}

export default Router
export { Router, getRouter, navigate, listen }
