import styled from 'styled-components'
import React, { Component } from 'react'

const Main = styled.select`
  border: 1px solid ${p => p.theme.lightgrey01};
  height: 40px;
  min-width: 200px;
  padding: 0 10px;

  &::placeholder {
    color: ${p => p.theme.lightgrey01};
  }

  &:focus {
    outline: none;
    border-color: ${p => p.theme.accent};
    box-shadow: rgba(0, 0, 0, 0.1) 0 2px 5px;
  }
`

class Select extends Component {
  render() {
    const { options, ...props } = this.props

    return (
      <Main {...props}>
        {options.map(option => (
          <option value={option.value} key={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </Main>
    )
  }
}

export default Select
