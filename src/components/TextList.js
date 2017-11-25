import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Ellipsis from 'components/base/Ellipsis'
import DifficultyBadge from 'components/DifficultyBadge'

const Container = styled.div`
  border-right: 1px solid ${p => p.theme.lightgrey01};
`

const Text = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${p => p.theme.lightgrey01};
  cursor: default;
  &:hover {
    background: ${p => p.theme.lightgrey03};
  }
  &:focus {
    outline: 1px dashed ${p => p.theme.blue};
  }
`

class TextList extends PureComponent {
  render() {
    const { width } = this.props
    return (
      <Container style={{ width }}>
        <Text tabIndex={0}>
          <Box horizontal flow={5} align="center">
            <Ellipsis>
              <b>first attempt</b>
            </Ellipsis>
            <DifficultyBadge level={3} />
          </Box>
        </Text>
        <Text>
          <Box horizontal flow={5} align="center">
            <Ellipsis>very long title of the week thing thing</Ellipsis>
            <DifficultyBadge level={2} />
          </Box>
        </Text>
      </Container>
    )
  }
}

export default TextList
