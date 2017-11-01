import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'

import { getPlayer, getText, typeChar, goNextWord, typeBackspace } from 'reducers/race'

const Container = styled.div`
  position: relative;
  font-family: monospace;
  user-select: none;
  min-height: 400px;

  &:hover {
    cursor: ${p => (p.isFocused ? 'default' : 'text')};
  }
`

const blink = p => keyframes`
  0% {
    box-shadow: white 0 0 0 1px, ${p.theme.darkGrey00} 0 0 0 2px;
    background: ${p.theme.darkGrey00};
    color: white;
  }
  49% {
    box-shadow: white 0 0 0 1px, ${p.theme.darkGrey00} 0 0 0 2px;
    background: ${p.theme.darkGrey00};
    color: white;
  }
  50% {
    box-shadow: none;
    background: transparent;
    color: ${p.theme.lightgrey00};
  }
  100% {
    box-shadow: none;
    background: transparent;
    color: ${p.theme.lightgrey00};
  }
`

const Cursor = styled.span`
  background: ${p =>
    p.isWrong ? p.theme.red : p.isDisabled ? p.theme.lightgrey00 : p.theme.darkGrey01};
  color: white;
  position: relative;
  min-width: 15px;
  z-index: 2;

  box-shadow: white 0 0 0 1px,
    ${p => (p.isWrong ? p.theme.red : p.isDisabled ? p.theme.lightgrey00 : p.theme.darkGrey01)} 0 0
      0 2px;
  white-space: pre;
  animation: ${p => (p.isBlinking ? `${blink(p)} 1s linear infinite` : 'none')};
`

const HiddenInput = styled.input`
  width: 0;
  height: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
`

const Text = styled.span`
  opacity: ${p => (p.isDisabled ? 0.5 : 1)};
  pointer-events: none;
  white-space: pre;
  color: ${p => (p.isWrong ? p.theme.red : '')};
`

const DISPLAYED_LINES = 15

@connect(
  state => ({
    player: getPlayer(state),
    text: getText(state),
    isStarted: state.race.get('isStarted'),
    isFinished: state.race.get('isFinished'),
  }),
  {
    typeChar,
    goNextWord,
    typeBackspace,
  },
)
class TypeWriter extends PureComponent {
  state = {
    isFocused: false,
  }

  componentDidMount() {
    window.requestAnimationFrame(() => this._input.focus())
  }

  componentDidUpdate(prevProps) {
    const { isFinished } = this.props
    const { isFinished: wasFinished } = prevProps
    if (wasFinished && !isFinished) {
      this.handleClick()
    }
  }

  handleFocus = () => this.setState({ isFocused: true })
  handleBlur = () => this.setState({ isFocused: false })
  handleClick = () => this._input.focus()

  handleKeyDown = e => {
    const { isDisabled, isStarted, onStart, goNextWord, typeBackspace } = this.props

    if (isDisabled) {
      return
    }

    if (e.which === 13) {
      if (!isStarted) {
        onStart()
      }
      goNextWord()
    }

    if (e.which === 8) {
      typeBackspace()
    }
  }

  handleChange = e => {
    const { typeChar, isStarted, isDisabled, text, player, onStart, goNextWord } = this.props
    const { value: char } = e.target

    if (isDisabled) {
      return
    }

    const charToType = text.get('raw')[player.get('cursor')]
    if (!charToType) {
      return
    }

    if (char === ' ' || !charToType.trim()) {
      return goNextWord()
    }

    if (!isStarted) {
      onStart()
    }

    typeChar(char)
  }

  render() {
    const { isFocused } = this.state
    const { player, text, isStarted } = this.props

    const cursor = player.get('cursor')
    const scroll = player.get('scroll')
    const wordIndex = player.get('wordIndex')

    let curLine = 1

    return (
      <Container onClick={this.handleClick} isFocused={isFocused}>
        {text.get('chunks').map((word, i) => {
          const isCurrent = wordIndex === i
          let res = null
          const wordContent = word.get('content')

          // render current word
          if (isCurrent) {
            const relativeCursor = cursor - word.get('start')
            const beforeCursor = wordContent.substring(0, relativeCursor)
            const afterCursor = wordContent.substring(relativeCursor + 1)
            const onCursor = wordContent[relativeCursor]
            res = [
              <Text key="before" isWrong={word.get('isWrong')} isDisabled={!isFocused}>
                {beforeCursor}
              </Text>,
              <Cursor
                key="on"
                isWrong={word.get('isWrong')}
                isBlinking={!isStarted && isFocused}
                isDisabled={!isFocused}
              >
                {onCursor}
              </Cursor>,
              <Text key="after" isDisabled>
                {afterCursor}
              </Text>,
            ]
          } else if (curLine > scroll && curLine <= scroll + DISPLAYED_LINES) {
            // render other words
            res = (
              <Text
                key={word.get('id')}
                isDisabled={!isFocused || i > wordIndex}
                isWrong={word.get('isWrong')}
              >
                {wordContent}
              </Text>
            )
          }

          if (wordContent.includes('\n')) {
            curLine++
          }

          return res
        })}

        <HiddenInput
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          innerRef={n => (this._input = n)}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          value={''}
        />
      </Container>
    )
  }
}

export default TypeWriter
