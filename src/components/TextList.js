import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Ellipsis from 'components/base/Ellipsis'
import DifficultyBadge from 'components/DifficultyBadge'

const Container = styled(Box)`
  border-right: 1px solid ${p => p.theme.lightgrey01};
`

const Text = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${p => p.theme.lightgrey01};
  cursor: default;
  &:hover {
    background: ${p => p.theme.lightgrey03};
  }
  &:active {
    background: ${p => p.theme.lightgrey02};
  }
  &:focus {
    outline: none;
  }
`

const Item = ({ isActive, level, label }) => (
  <Text tabIndex={0}>
    <Box horizontal flow={5} align="center">
      <Ellipsis>{isActive ? <b>{label}</b> : label}</Ellipsis>
      <DifficultyBadge level={level} />
    </Box>
  </Text>
)

class TextList extends PureComponent {
  render() {
    const { width } = this.props
    return (
      <Container relative style={{ width }}>
        <Box sticky scrollable>
          <Item level={3} label="first attempt" />
          <Item isActive level={2} label="very long title of the week thing thing" />
          <Item level={4} label="osa snoth sanot" />
          <Item level={5} label="asn taaantuh  noath" />
          <Item level={0} label="noob" />
        </Box>
      </Container>
    )
  }
}

export default TextList
