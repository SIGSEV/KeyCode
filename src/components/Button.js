import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'
import { findDOMNode } from 'react-dom'

const BtnEl = props => <button {...props} />

/* eslint-disable no-unused-vars */
const stylize = El => styled(({ accent, grey, ...props }) => <El {...props} />)`
  display: inline-flex;
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

  &:hover:after {
    background: rgba(255, 255, 255, 0.05);
  }

  &:active:after {
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

class Button extends PureComponent {
  focus() {
    const node = findDOMNode(this) // eslint-disable-line react/no-find-dom-node
    node.focus()
  }
  render() {
    const { children, linkTo, ...props } = this.props
    const content = <Wrapper>{children}</Wrapper>
    return linkTo ? (
      <Link to={linkTo} {...props}>
        {content}
      </Link>
    ) : (
      <Btn {...props}>{content}</Btn>
    )
  }
}

export default Button
