
import React from 'react'
import Link from 'react-router-dom/Link'
import Route from 'react-router-dom/Route'
import { OutboundLink } from 'react-ga'

const OptionalLink = props => {

    const {
        target,
        to,
        href,
        internal,
        eventLabel,
        activeClassName,
        ...otherProps
    } = props

    if (href) {
        if (internal) {
            return <a href={href} target={target} {...otherProps} />
        } else {
            return <OutboundLink eventLabel={eventLabel || otherProps.title || href} to={href} target={target || '_blank'} {...otherProps} />
        }
    }

    if (to) {

        if (activeClassName) {

            const {
                className,
                ...finalProps
            } = otherProps

            return (
                <Route path={to}>
                    {({ match }) => {
                        var finalClassName = match ? `${className || ''} ${activeClassName || ''}` : className
                        return <Link to={to} className={finalClassName} {...finalProps} />
                    }}
                </Route>
            )
        }

        return <Link to={to} {...otherProps} />
    }

    return <span {...otherProps} />
}

export default OptionalLink
