import React from 'react'
import styled from 'styled-components'

import Link from 'components/Link'

const Bold = styled.div`
  font-family: InterBolder;
  font-size: 20px;
  color: ${p => p.theme.darkGrey00};
  user-select: none;
`

export default () => (
  <Link to="/">
    <Bold>{'KeyCode'}</Bold>
  </Link>
)
