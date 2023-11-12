
import React, { Component } from 'react'
import Transition from 'react-transition-group/Transition'

const fixTransition = node => node.offsetHeight

export function withTransition(extraProps) {
    return TargetComponent => class TransitionHOC extends Component {

        render() {

            const {
                active,
                transition,
            } = this.props

            return (
                <Transition appear mountOnEnter unmountOnExit onEnter={fixTransition} {...extraProps} {...transition} in={active}>
                    {this.renderComponent}
                </Transition>
            )
        }

        renderComponent = (state) => {

            const {
                /* eslint-disable no-unused-vars */
                active,
                transition,
                /* eslint-enable no-unused-vars */
                ...otherProps
            } = this.props

            return <TargetComponent transitionState={state} {...otherProps} />
        }

    }
}
