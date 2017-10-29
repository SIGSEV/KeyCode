import React, { PureComponent } from 'react'
import shortid from 'shortid'
import styled, { keyframes } from 'styled-components'
import { Map, List } from 'immutable'

function countLinesOffset(words, start, end) {
  return words
    .slice(start, end)
    .reduce((count, word) => count + word.get('content').split('\n').length - 1, 0)
}

const Container = styled.div`
  position: relative;
  font-family: monospace;
  user-select: none;
  background: white;

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

class TypeWriter extends PureComponent {
  state = {
    cursor: 0,
    wordIndex: 0,
    scroll: 0,
    line: 0,
    totalLines: 0,
    words: List(),
    typedWord: '',
    isFocused: false,
    isStarted: false,
  }

  componentWillMount() {
    const { text, onCountWords } = this.props
    const words = text
      .split('')
      .reduce((acc, char, i) => {
        let word = acc.last()
        if (!word || word.get('done')) {
          word = Map({ start: i, done: false, id: shortid.generate() })
          acc = acc.push(word)
        }
        word = word.set('end', i)
        word = word.set(
          'content',
          text.substring(word.get('start'), word.get('end') + (i === text.length - 1 ? 2 : 1)),
        )
        if (!char.trim()) {
          word = word.set('done', true)
        } else {
          word = word.set('end', i)
        }
        acc = acc.set(acc.size - 1, word)
        return acc
      }, List())
      .map(word => word.set('empty', !word.get('content').trim()))

    const nonEmptyWords = words.filter(w => !w.get('empty')).size
    onCountWords(nonEmptyWords)

    this.setState({ words, totalLines: countLinesOffset(words, 0, words.size - 1) })
  }

  componentDidMount() {
    window.requestAnimationFrame(() => this._input.focus())
  }

  handleFocus = () => this.setState({ isFocused: true })
  handleBlur = () => this.setState({ isFocused: false })
  handleClick = () => this._input.focus()

  handleKeyDown = e => {
    if (!this.state.isStarted) {
      this.setState({ isStarted: true })
    }
    if (e.which === 13) {
      this.handleNext()
    }
    if (e.which === 8) {
      this.handleBackspace()
    }
  }

  handleBackspace = () => {
    const { onCorrection } = this.props
    const { wordIndex, words, cursor, typedWord } = this.state
    const word = words.get(wordIndex)
    if (cursor === word.get('start')) {
      return
    }
    const newTypedWord = typedWord.substr(0, typedWord.length - 1)
    const nextState = {
      cursor: cursor - 1,
      typedWord: newTypedWord,
    }
    if (word.get('content').startsWith(newTypedWord)) {
      nextState.words = this.state.words.setIn([wordIndex, 'isWrong'], false)
    }
    this.setState(nextState)
    onCorrection()
  }

  handleChange = e => {
    const { text, onChar } = this.props
    const { cursor, wordIndex, typedWord, words } = this.state
    const { value } = e.target
    const char = text[cursor]
    if (!char) {
      return
    }
    if (value === ' ' || !char.trim()) {
      return this.handleNext()
    }
    onChar(value)
    const word = words.get(wordIndex)
    const newTypedWord = `${typedWord}${value}`
    const nextState = { cursor: this.state.cursor + 1, typedWord: newTypedWord }
    if (!word.get('content').startsWith(newTypedWord)) {
      nextState.words = this.state.words.setIn([wordIndex, 'isWrong'], true)
    }
    this.setState(nextState)
  }

  handleNext = () => {
    const { wordIndex, words, typedWord, scroll, line, totalLines } = this.state
    const { onValidateWrongWord, onValidateWord } = this.props
    const nextWordIndex = words.findIndex((w, i) => i > wordIndex && !w.get('empty'))
    const nextState = { typedWord: '', words }
    const word = words.get(wordIndex)
    const jumps = countLinesOffset(words, wordIndex, nextWordIndex)

    if (jumps > 0) {
      nextState.line = line + jumps
      if (
        nextState.line - scroll > DISPLAYED_LINES / 2 - 1 &&
        totalLines - scroll > DISPLAYED_LINES - 1
      ) {
        nextState.scroll = scroll + jumps
      }
    }

    if (!typedWord || typedWord.length !== word.get('content').trim().length) {
      nextState.words = words.setIn([wordIndex, 'isWrong'], true)
    }

    if (nextWordIndex === -1) {
      nextState.cursor = words.getIn([wordIndex, 'end']) + 1
    } else {
      const nextWord = words.get(nextWordIndex)
      Object.assign(nextState, {
        wordIndex: nextWordIndex,
        cursor: nextWord.get('start'),
        typedWord: '',
      })
    }

    this.setState(nextState)

    if (nextState.words.getIn([wordIndex, 'isWrong'])) {
      onValidateWrongWord()
    } else {
      onValidateWord()
    }
  }

  render() {
    const { cursor, isFocused, isStarted, words, wordIndex, scroll } = this.state
    let curLine = 1

    return (
      <Container onClick={this.handleClick} isFocused={isFocused}>
        {words.map((word, i) => {
          const isCurrent = wordIndex === i
          let res = null
          if (isCurrent) {
            const content = word.get('content')
            const relativeCursor = cursor - word.get('start')
            const beforeCursor = content.substring(0, relativeCursor)
            const afterCursor = content.substring(relativeCursor + 1)
            const onCursor = content[relativeCursor]
            res = [
              <Text key="before" isWrong={word.get('isWrong')}>
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
            res = (
              <Text
                key={word.get('id')}
                isDisabled={!isFocused || i > wordIndex}
                isWrong={word.get('isWrong')}
              >
                {word.get('content')}
              </Text>
            )
          }
          if (word.get('content').includes('\n')) {
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
