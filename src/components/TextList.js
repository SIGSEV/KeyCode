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

const Reviewed = styled.div`
  font-size: 11px;
  white-space: nowrap;
  border-radius: 2px;
  color: white;
  background-color: ${p => p.theme.green};
  padding: 1px 3px;
`

const Item = ({ onClick, grades, isActive, isReviewed, label }) => (
  <Text onClick={onClick} tabIndex={0}>
    <Box horizontal flow={5} align="center">
      <Dots>{grades.map(grade => <Dot key={grade.get('_id')} grade={grade.get('value')} />)}</Dots>
      {isReviewed && <Reviewed>{'reviewed'}</Reviewed>}
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
              isReviewed={text.get('difficulty') !== 0}
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
