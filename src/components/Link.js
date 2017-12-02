import React from 'react'
import color from 'color'
import styled from 'styled-components'
import { Link as ReactRouterLink } from 'react-router-dom'

const Link = ({ className, to, children, ...props }) =>
  to ? (
    <ReactRouterLink className={className} to={to} {...props}>
      {children}
    </ReactRouterLink>
  ) : (
    <a className={className} {...props}>
      {children}
    </a>
  )

const StyledLink = styled(Link)`
  color: ${p => p.theme.link};
  text-decoration: none;

  &:hover {
    color: ${p =>
      color(p.theme.link)
        .lighten(0.2)
        .string()};
  }

  &:active {
    color: ${p =>
      color(p.theme.link)
        .lighten(0.3)
        .string()};
  }

  &:focus {
    outline: 1px dashed;
  }
`

export default StyledLink
