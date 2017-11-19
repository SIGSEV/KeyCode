import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { getColor } from 'helpers/colors'

export default styled(p => <Link to={`/l/${p.type.toLowerCase()}`} {...p} />)`
  display: inline-block;
  width: ${p => p.size || '0.5rem'};
  height: ${p => p.size || '0.5rem'};
  background-color: ${p => getColor(p.type)};
  border-radius: 50%;
`
