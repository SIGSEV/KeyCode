import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Ellipsis from 'components/base/Ellipsis'

const Container = styled(Box)`
  border-right: 1px solid ${p => p.theme.lightgrey01};
`

const Text = styled.div`
  padding: 10px;
  border-bottom: 1px solid ${p => p.theme.lightgrey01};
  cursor: pointer;

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

const Dots = styled.div`
  margin-right: 0.5rem;
  > * + * {
    margin-top: 0.2rem;
  }
`

const Dot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${p => p.theme.grades[p.grade]};
`

const Item = ({ onClick, grades, isActive, label }) => (
  <Text onClick={onClick} tabIndex={0}>
    <Box horizontal flow={5} align="center">
      <Dots>{grades.map(grade => <Dot key={grade.get('user')} grade={grade.get('value')} />)}</Dots>
      <Ellipsis>{isActive ? <b>{label}</b> : label}</Ellipsis>
    </Box>
  </Text>
)

class TextList extends PureComponent {
  render() {
    const { width, texts, onClick, focusedText } = this.props

    return (
      <Container relative style={{ width }}>
        <Box sticky scrollable>
          {texts.map(text => (
            <Item
              grades={text.get('grades')}
              onClick={() => onClick(text)}
              isActive={text.get('id') === focusedText}
              label={text.get('title')}
              key={text.get('id')}
            />
          ))}
        </Box>
      </Container>
    )
  }
}

export default TextList
