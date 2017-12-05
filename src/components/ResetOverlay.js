import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const ResetOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 30px;
  font-weight: bold;
  z-index: 20;
  padding: 20px;
`

const Kbd = styled.div`
  padding: 20px;
  border: 2px solid white;
  border-radius: 5px;
`

export default () => (
  <ResetOverlay horizontal align="center" justify="center" flow={20}>
    <span>{'Press'}</span>
    <Kbd>{'Enter'}</Kbd>
    <span>{'to restart'}</span>
  </ResetOverlay>
)