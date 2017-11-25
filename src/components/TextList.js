import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border-right: 1px solid ${p => p.theme.lightgrey01};
`

const Text = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${p => p.theme.lightgrey01};
`

const TextTitle = styled.div``

class TextList extends PureComponent {
  render() {
    const { width } = this.props
    return (
      <Container style={{ width }}>
        <Text>
          <TextTitle>text title</TextTitle>
        </Text>
        <Text>
          <TextTitle>text title</TextTitle>
        </Text>
        <Text>
          <TextTitle>text title</TextTitle>
        </Text>
        <Text>
          <TextTitle>text title</TextTitle>
        </Text>
      </Container>
    )
  }
}

export default TextList
