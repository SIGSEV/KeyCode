import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'

import { getPlayer, getText, typeChar, setMaxDisplayedLines } from 'reducers/race'

import StatusBar from 'components/StatusBar'
import Box from 'components/base/Box'

const Container = styled.div`
  position: relative;
  background: white;
  padding: 10px;
  font-size: 16px;
  line-height: 24px;
  user-select: none;
  width: 800px;
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
  font-family: monospace;
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
  font-family: monospace;
  opacity: ${p => (p.isDisabled ? 0.5 : 1)};
  pointer-events: none;
  white-space: pre;
  background-color: ${p => (p.isHardWrong ? p.theme.red : '')};
  color: ${p => (p.isWrong ? p.theme.red : p.isHardWrong ? 'white' : '')};
`

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

@connect(
  state => ({
    player: getPlayer(state),
    text: getText(state),
    isStarted: state.race.get('isStarted'),
    isFinished: state.race.get('isFinished'),
    isGhosting: state.race.get('isGhosting'),
  }),
  {
    typeChar,
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
    const { isFinished: willFinish } = nextProps
    const { isFinished, isGhosting } = this.props

    if (!isFinished && willFinish) {
      this._recording = false
    }

    const hasTypedAllWords =
      nextProps.player.get('typedWordsCount') === nextProps.text.get('wordsCount')
    if (hasTypedAllWords && !isGhosting) {
      this.props.onFinish()
    }
  }

  componentDidUpdate(prevProps) {
    const { isFinished, showReset } = this.props
    const { isFinished: wasFinished, showReset: wasShowingReset } = prevProps
    if (wasFinished && !isFinished) {
      this.handleClick()
      this.measureContainer()
    }

    if (!wasShowingReset && showReset) {
      this.addResetListener()
    }

    if (wasShowingReset && !showReset) {
      this.removeResetListener()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainer)
    this.removeResetListener()
  }

  addResetListener = () => {
    window.addEventListener('keydown', this.onEnter)
  }

  removeResetListener = () => {
    window.removeEventListener('keydown', this.onEnter)
  }

  onEnter = e => {
    if (e.which === 13) {
      this.props.onRestart()
      this.handleClick()
    }
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
    const { isFinished, typeChar, isStarted, isGhosting, onStart } = this.props

    if (isFinished || isGhosting) {
      return
    }

    if (e.which === 13) {
      const charToType = this.getCharToType().trim()
      if (!charToType) {
        if (!isStarted) {
          onStart()
        }

        this.logChar(0)
        typeChar(0)
      }
    }

    if (e.which === 8) {
      this.logChar(-1)
      typeChar(-1)
    }
  }

  handleChange = e => {
    const { typeChar, isStarted, isGhosting, isFinished, onStart } = this.props
    const { value: char } = e.target

    if (isFinished || isGhosting) {
      return
    }

    if (!isStarted) {
      onStart()
    }

    const charCode = char.charCodeAt()
    this.logChar(charCode)
    typeChar(charCode)
  }

  logChar = char => {
    const { isGhosting } = this.props
    if (isGhosting) {
      return
    }

    if (!this._recording) {
      this._recording = true
      this._lastLog = null
      this._log = []
    }

    const now = Date.now()
    const spe = typeof char === 'number'
    this._log.push([spe ? char : char.charCodeAt(0), this._lastLog ? now - this._lastLog : 0])
    this._lastLog = now
  }

  getCompressedLog() {
    return this._log.map(e => e.join('|')).join(' ')
  }

  getCharToType = () => {
    const { text, player } = this.props
    const rawText = text.get('raw')
    return rawText[player.get('cursor')] || ''
  }

  render() {
    const { isFocused } = this.state
    const { player, text, isGhosting, isStarted, chronos, innerRef, showReset } = this.props

    innerRef(this)

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
        isFocused={isFocused || isGhosting}
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
                      <Cursor
                        key={i}
                        isBlinking={!isStarted && isFocused && !isGhosting}
                        isDisabled={!isFocused && !isGhosting}
                      >
                        {chunk.content}
                      </Cursor>
                    ) : (
                      <Text
                        key={i}
                        isHardWrong={chunk.isWrong}
                        isDisabled={(!isFocused && !isGhosting) || i > cursorIndexInWord}
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
                    isDisabled={(!isFocused && !isGhosting) || i > wordIndex}
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

        <StatusBar>{isGhosting ? null : chronos}</StatusBar>
        {showReset && (
          <ResetOverlay horizontal align="center" justify="center" flow={20}>
            <span>{'Press'}</span>
            <Kbd>{'Enter'}</Kbd>
            <span>{'to restart'}</span>
          </ResetOverlay>
        )}
      </Container>
    )
  }
}

export default TypeWriter
