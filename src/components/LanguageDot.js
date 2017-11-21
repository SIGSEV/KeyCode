import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { getColor, getTextRGB } from 'helpers/colors'

export default styled(p => <Link to={`/l/${p.type.toLowerCase()}`} {...p} />)`
  display: inline-block;
  width: ${p => p.size || '0.5rem'};
  height: ${p => p.size || '0.5rem'};
  background-color: ${p => getColor(p.type)};
  border-radius: 50%;
  outline: none;
  border: 1px dashed transparent;

  &:focus {
    border-color: rgba(${p => getTextRGB(getColor(p.type))}, 0.7);
  }
`
