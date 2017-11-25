import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import IconLoading from 'react-icons/lib/md/watch'
import styled, { keyframes } from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import { findDOMNode } from 'react-dom'
import { Motion, spring } from 'react-motion'

const BtnEl = ({ isLoading, isDisabled, ...props }) => (
  <button disabled={isLoading || isDisabled} {...props} />
)

/* eslint-disable no-unused-vars */
const stylize = El => styled(({ accent, push, action, grey, minWait, ...props }) => (
  <El {...props} />
))`
  position: relative;
  display: inline-flex;
  opacity: ${p => (p.isLoading || p.isDisabled ? 0.7 : 1)};
  overflow: hidden;
  background: ${p =>
    p.accent ? p.theme.accent : p.grey ? p.theme.darkGrey02 : p.theme.darkGrey00};
  border-radius: 2px;
  font-size: 12px;
  padding: 3px;
  text-transform: uppercase;
  color: white;
  outline: none;
  position: relative;
  user-select: none;
  text-decoration: none;
  cursor: pointer;
  flex-shrink: 0;
  white-space: no-wrap;

  &:focus > div {
    border-color: rgba(255, 255, 255, 0.7);
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:hover:not(:disabled):after {
    background-color: rgba(255, 255, 255, 0.05);
  }

  &:active:not(:disabled):after {
    background-color: rgba(0, 0, 0, 0.1);
  }
`
/* eslint-enable no-unused-vars */

const Btn = stylize(BtnEl)
const Link = stylize(RouterLink)

const Wrapper = styled.div`
  display: flex;
  height: ${p => (p.noHeight ? 'initial' : '40px')};
  padding: ${p => (p.smallPad ? '0 5px' : '0 20px')};
  align-items: center;
  border: 1px dashed transparent;
  font-weight: bold;
  text-shadow: rgba(0, 0, 0, 0.2) 0 1px 0;
`

const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(180deg); }
`

const Spinner = styled(IconLoading)`
  animation: ${rotate} 250ms linear infinite;
`

const springConfig = {
  stiffness: 200,
  damping: 25,
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

@connect(null, {
  push,
})
class Button extends PureComponent {
  static propTypes = {
    minWait: PropTypes.number,
  }

  static defaultProps = {
    minWait: 500,
    hasloader: 1,
  }

  state = {
    isLoading: false,
  }

  componentWillUnmount() {
    this._unmounted = true
  }

  safeSetState = (...args) => {
    if (this._unmounted) {
      return
    }
    this.setState(...args)
  }

  focus() {
    const node = findDOMNode(this) // eslint-disable-line react/no-find-dom-node
    node.focus()
  }

  handleAction = async () => {
    const { action, to, push, hasloader, minWait } = this.props
    if (hasloader) {
      this.safeSetState({ isLoading: true })
    }

    try {
      const before = performance.now()
      await action()
      const after = performance.now()
      const elapsed = after - before
      if (elapsed < minWait) {
        await sleep(minWait - elapsed)
      }
      this.safeSetState({ isLoading: false })
      if (to) {
        push(to)
      }
    } catch (err) {
      console.error(err) // eslint-disable-line no-console
      this.safeSetState({ isLoading: false })
    }
  }

  render() {
    const { isLoading: stateIsLoading } = this.state
    const {
      children,
      setRef,
      to,
      onClick,
      action,
      isLoading: propsIsLoading,
      smallPad,
      noHeight,
      ...props
    } = this.props

    const isLoading = stateIsLoading || propsIsLoading

    if (setRef) {
      setRef(this)
    }

    const content = (
      <Motion
        style={{
          offset: spring(isLoading ? 100 : 0, springConfig),
          opacity: spring(isLoading ? 0 : 1, springConfig),
        }}
      >
        {m => (
          <Wrapper
            smallPad={smallPad}
            noHeight={noHeight}
            style={{ transform: `translate3d(${m.offset}%, 0, 0)`, opacity: m.opacity }}
          >
            {children}
          </Wrapper>
        )}
      </Motion>
    )

    const realOnClick = isLoading ? undefined : action ? this.handleAction : onClick
    return to && !action ? (
      <Link to={to} {...props}>
        {content}
      </Link>
    ) : (
      <Btn onClick={realOnClick} isLoading={isLoading} {...props}>
        <Motion style={{ offset: spring(isLoading ? 0 : -100, springConfig) }}>
          {m => (
            <Loader style={{ transform: `translate3d(${m.offset}%, 0, 0)` }}>
              <Spinner size={24} />
            </Loader>
          )}
        </Motion>
        {content}
      </Btn>
    )
  }
}

export default Button
