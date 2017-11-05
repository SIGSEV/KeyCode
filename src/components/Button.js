import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import IconLoading from 'react-icons/lib/md/watch'
import styled, { keyframes } from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import { findDOMNode } from 'react-dom'
import { Motion, spring } from 'react-motion'

const BtnEl = ({ isLoading, ...props }) => <button disabled={isLoading} {...props} />

/* eslint-disable no-unused-vars */
const stylize = El => styled(({ accent, push, action, grey, ...props }) => <El {...props} />)`
  position: relative;
  display: inline-flex;
  opacity: ${p => (p.isLoading ? 0.7 : 1)};
  overflow: hidden;
  background: ${p =>
    p.accent ? p.theme.accent : p.grey ? p.theme.darkGrey02 : p.theme.darkGrey00};
  border-radius: 2px;
  font-size: 12px;
  padding: 3px;
  color: white;
  outline: none;
  position: relative;
  user-select: none;
  text-decoration: none;

  &:focus > div {
    border-color: rgba(255, 255, 255, 0.4);
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
    background: rgba(255, 255, 255, 0.05);
  }

  &:active:not(:disabled):after {
    background: rgba(0, 0, 0, 0.1);
  }
`
/* eslint-enable no-unused-vars */

const Btn = stylize(BtnEl)
const Link = stylize(RouterLink)

const Wrapper = styled.div`
  display: flex;
  height: 40px;
  padding: 0 20px;
  align-items: center;
  border: 1px dashed transparent;
  text-transform: uppercase;
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

@connect(null, {
  push,
})
class Button extends PureComponent {
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
    const { action, to, push } = this.props
    this.safeSetState({ isLoading: true })
    try {
      await action()
      this.safeSetState({ isLoading: false })
      if (push) {
        push(to)
      }
    } catch (err) {
      console.error(err) // eslint-disable-line no-console
      this.safeSetState({ isLoading: false })
    }
  }

  render() {
    const { isLoading } = this.state
    const { children, setRef, to, onClick, action, ...props } = this.props

    if (setRef) {
      setRef(this)
    }

    const content = (
      <Motion
        style={{
          offset: spring(isLoading ? 100 : 0, springConfig),
        }}
      >
        {m => (
          <Wrapper style={{ transform: `translate3d(${m.offset}%, 0, 0)` }}>{children}</Wrapper>
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
