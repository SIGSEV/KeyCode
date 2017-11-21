import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'

import {
  getPlayer,
  getText,
  typeChar,
  goNextWord,
  typeBackspace,
  setMaxDisplayedLines,
} from 'reducers/race'

import StatusBar from 'components/StatusBar'

const Container = styled.div`
  position: relative;
  font-family: monospace;
  background: white;
  padding: 10px;
  font-size: 16px;
  line-height: 24px;
  user-select: none;
  width: 600px;
  overflow: hidden;

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
  background-color: ${p => (p.isHardWrong ? p.theme.red : '')};
  color: ${p => (p.isWrong ? p.theme.red : p.isHardWrong ? 'white' : '')};
`

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
    setMaxDisplayedLines,
  },
)
class TypeWriter extends PureComponent {
  state = {
    isFocused: false,
  }

  componentDidMount() {
    window.addEventListener('resize', this.measureContainer)
    window.requestAnimationFrame(() => {
      this._input.focus()
      this.measureContainer()
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.player.get('typedWordsCount') === nextProps.text.get('wordsCount')) {
      this.props.onFinish()
    }
  }

  componentDidUpdate(prevProps) {
    const { isFinished } = this.props
    const { isFinished: wasFinished } = prevProps
    if (wasFinished && !isFinished) {
      this.handleClick()
      this.measureContainer()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainer)
  }

  measureContainer = () => {
    const rect = this._container.getBoundingClientRect()
    const { height } = rect
    const maxDisplayedLines = Math.floor(height / 24) - 1
    this.props.setMaxDisplayedLines(Math.max(maxDisplayedLines, 0))
  }

  handleFocus = () => this.setState({ isFocused: true })
  handleBlur = () => this.setState({ isFocused: false })
  handleClick = () => this._input.focus()

  handleKeyDown = e => {
    const { isFinished, isStarted, onStart, goNextWord, typeBackspace } = this.props

    if (isFinished) {
      return
    }

    if (e.which === 13) {
      const charToType = this.getCharToType().trim()
      if (!charToType) {
        if (!isStarted) {
          onStart()
        }
        goNextWord()
      }
    }

    if (e.which === 8) {
      typeBackspace()
    }
  }

  handleChange = e => {
    const { typeChar, isStarted, isFinished, text, player, onStart, goNextWord } = this.props
    const { value: char } = e.target

    if (isFinished) {
      return
    }

    if (!isStarted) {
      onStart()
    }

    const rawText = text.get('raw')
    const charToType = this.getCharToType()
    const cursor = player.get('cursor')

    if (cursor === rawText.length - 1) {
      typeChar(char)
      return goNextWord()
    }

    const isEndOfWord = !charToType.trim()
    const hasTypedSpace = char === ' '

    if (isEndOfWord) {
      return goNextWord(hasTypedSpace)
    }

    typeChar(char)
  }

  getCharToType = () => {
    const { text, player } = this.props
    const rawText = text.get('raw')
    return rawText[player.get('cursor')] || ''
  }

  render() {
    const { isFocused } = this.state
    const { player, text, isStarted, chronos } = this.props

    const cursor = player.get('cursor')
    const scrollY = player.get('scrollY')
    const scrollX = player.get('scrollX')
    const wordIndex = player.get('wordIndex')
    const typedWord = player.get('typedWord')
    const maxDisplayedLines = player.get('maxDisplayedLines')
    const chunks = text.get('chunks')

    let curLine = 1

    return (
      <Container
        onClick={this.handleClick}
        isFocused={isFocused}
        innerRef={n => (this._container = n)}
      >
        {maxDisplayedLines
          ? chunks.map((word, i) => {
              const isCurrent = wordIndex === i
              let res = null
              const wordContent = word.get('content')
              const indexInLine = word.get('indexInLine')
              const scrollHide = scrollX > indexInLine

              // render current word
              if (isCurrent) {
                const relativeCursor = cursor - word.get('start')

                const wordChunks = wordContent.split('').reduce((acc, char, i) => {
                  if (scrollHide && i < scrollX - indexInLine) {
                    return acc
                  }
                  const isCursor = i === relativeCursor
                  const isWrong =
                    !isCursor && wordContent[i] !== typedWord[i] && i < typedWord.length
                  const last = acc[acc.length - 1]
                  if (isCursor || !last || last.isWrong !== isWrong || last.isCursor) {
                    acc.push({ isWrong, isCursor, content: char })
                  } else {
                    last.content += char
                  }
                  return acc
                }, [])

                const cursorIndexInWord = wordChunks.findIndex(c => c.isCursor)

                /* eslint-disable react/no-array-index-key */
                res = wordChunks.map(
                  (chunk, i) =>
                    chunk.isCursor ? (
                      <Cursor key={i} isBlinking={!isStarted && isFocused} isDisabled={!isFocused}>
                        {chunk.content}
                      </Cursor>
                    ) : (
                      <Text
                        key={i}
                        isHardWrong={chunk.isWrong}
                        isDisabled={!isFocused || i > cursorIndexInWord}
                      >
                        {chunk.content}
                      </Text>
                    ),
                )
                /* eslint-enable react/no-array-index-key */
              } else if (curLine > scrollY && curLine <= scrollY + maxDisplayedLines) {
                // render other words
                const hasReturn = wordContent.endsWith('\n')
                let toDisplay = scrollHide ? wordContent.substr(scrollX - indexInLine) : wordContent
                if (hasReturn && !toDisplay.endsWith('\n')) {
                  toDisplay = `${toDisplay}\n`
                }
                res = (
                  <Text
                    key={word.get('id')}
                    isDisabled={!isFocused || i > wordIndex}
                    isWrong={word.get('isWrong')}
                  >
                    {toDisplay}
                  </Text>
                )
              }

              if (wordContent.includes('\n')) {
                curLine++
              }

              return res
            })
          : null}

        <HiddenInput
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          innerRef={n => (this._input = n)}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          value={''}
        />

        <StatusBar>{chronos}</StatusBar>
      </Container>
    )
  }
}

export default TypeWriter
