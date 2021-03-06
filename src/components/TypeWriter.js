import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'

import getTypeSplits from 'helpers/getTypeSplits'

import { getPlayer, getPlayers, getText, typeChar, setDimensions } from 'reducers/race'

import StatusBar from 'components/StatusBar'
import GhostInfos from 'components/GhostInfos'
import ResetOverlay from 'components/ResetOverlay'
import Box from 'components/base/Box'

const Container = styled(Box)`
  background: white;
  font-size: 16px;
  line-height: 24px;
  user-select: none;

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

const ResetBtn = styled.button`
  opacity: 0;
  width: 0;
  height: 0;
`

@connect(
  state => ({
    player: getPlayer(state),
    players: getPlayers(state),
    text: getText(state),
    ghost: state.race.get('ghost'),
    isStarted: state.race.get('isStarted'),
    isFinished: state.race.get('isFinished'),
    isGhosting: state.race.get('isGhosting'),
  }),
  {
    typeChar,
    setDimensions,
  },
)
class TypeWriter extends PureComponent {
  state = {
    isFocused: false,
    showReset: false,
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

  componentDidUpdate(prevProps, prevState) {
    const { isFinished, ghost } = this.props
    const { isFinished: wasFinished, ghost: prevGhost } = prevProps
    const { showReset } = this.state
    const { showReset: wasShowingReset } = prevState

    if (wasFinished && !isFinished) {
      this.handleClick()
      this.measureContainer()
    }

    if (ghost !== prevGhost) {
      this.measureContainer()
    }

    if (!prevGhost && ghost) {
      this.handleClick()
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

  handleShowReset = () => this.setState({ showReset: true })
  handleHideReset = () => this.setState({ showReset: false })

  addResetListener = () => window.addEventListener('keydown', this.onListenReset)
  removeResetListener = () => window.removeEventListener('keydown', this.onListenReset)

  onListenReset = e => {
    if (e.which === 13) {
      this.props.onRestart()
      this.handleClick()
    }
  }

  measureContainer = () => {
    const rect = this._container.getBoundingClientRect()
    const { height, width } = rect
    const maxDisplayedLines = Math.max(Math.floor(height / 24), 0)
    const maxDisplayedCols = Math.max(Math.floor(width / 10) - 1, 0)
    const dimensions = {
      maxDisplayedLines,
      maxDisplayedCols,
    }
    this.props.setDimensions(dimensions)
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

  resetLog() {
    this._log = []
  }

  getCharToType = () => {
    const { text, player } = this.props
    const rawText = text.get('raw')
    return rawText[player.get('cursor')] || ''
  }

  renderText() {
    const { text, players, isStarted, isGhosting } = this.props
    const { isFocused } = this.state
    const splits = getTypeSplits(text.get('chunks'), players)
    return splits.map(({ text, type, players }, i) => {
      const key = `${i}-${type}-${players.length}`
      let r =
        type === 'cursor' ? (
          <Cursor
            key={key}
            isBlinking={!isStarted && isFocused && !isGhosting}
            isDisabled={!isFocused && !isGhosting}
          >
            {text}
          </Cursor>
        ) : (
          <Text
            key={key}
            isDisabled={(!isFocused && !isGhosting) || type === 'untouched'}
            isWrong={type === 'wrong'}
            isHardWrong={type === 'hardWrong'}
          >
            {text}
          </Text>
        )
      if (players.length) {
        r = (
          <span key={key} style={{ position: 'relative', outline: '2px solid #1687ee' }}>
            {r}
          </span>
        )
      }
      return r
    })
  }

  render() {
    const { isFocused, showReset } = this.state
    const { player, ghost, isGhosting, chronos, innerRef } = this.props

    innerRef(this)

    const maxDisplayedLines = player.get('maxDisplayedLines')

    return (
      <Container relative grow onClick={this.handleClick} isFocused={isFocused || isGhosting}>
        <Box grow flow={10}>
          <StatusBar>{isGhosting ? null : chronos}</StatusBar>
          {!!ghost && <GhostInfos ghost={ghost} />}
          <Box grow innerRef={n => (this._container = n)} relative>
            {maxDisplayedLines > 0 && (
              <Box sticky>
                <div>{this.renderText()}</div>
              </Box>
            )}
          </Box>
        </Box>

        <HiddenInput
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          innerRef={n => (this._input = n)}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          value={''}
        />

        <ResetBtn onFocus={this.handleShowReset} onBlur={this.handleHideReset} />

        {showReset && <ResetOverlay />}
      </Container>
    )
  }
}

export default TypeWriter
