import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { Map } from 'immutable'

import TypeWriter from 'components/TypeWriter'
import Typematrix from 'components/Typematrix'
import Chronos from 'components/Chronos'
import ProgressBar from 'components/ProgressBar'
import FinishBoard from 'components/FinishBoard'

const Container = styled.div`
  color: ${p => p.theme.darkGrey00};
  font-size: 18px;
  line-height: 24px;
  flex-grow: 1;
  overflow: hidden;
  margin: 0 -2px;
  padding: 0 2px;
  position: relative;
`

const animLeave = keyframes`
  0% { transform: translate3d(0, 0, 0); opacity: 1; }
  100% { transform: translate3d(0, -10%, 0); opacity: 0; }
`

const GameLayer = styled.div`
  will-change: transform;
  animation: ${p =>
    p.isFinished ? `${animLeave} cubic-bezier(0.78, 0.01, 0.23, 0.97) 700ms` : undefined};
  animation-fill-mode: forwards;
`

const GameHeader = styled.div`
  display: flex;
  align-items: center;
`

const GameHeaderRight = styled.div`
  margin-left: auto;
`

function getInitialState() {
  return {
    activeChar: null,
    isRunning: false,
    isFinished: false,
    stats: Map({
      words: 0,
      wrongWords: 0,
      corrections: 0,
      typedWords: 0,
    }),
  }
}

class Game extends PureComponent {
  state = getInitialState()

  handleCountNonBlankWords = count => {
    this.setState({ stats: this.state.stats.set('nonBlankWords', count) })
  }

  handleCorrection = () => {
    const { stats } = this.state
    const corrections = stats.get('corrections')
    this.setState({ stats: stats.set('corrections', corrections + 1) })
  }

  handleValidateWord = () => {
    const { stats } = this.state
    const typedWords = stats.get('typedWords')
    this.setState({ stats: stats.set('typedWords', typedWords + 1) })
  }

  handleValidateWrongWord = () => {
    const { stats } = this.state
    const wrongWords = stats.get('wrongWords')
    const typedWords = stats.get('typedWords')
    this.setState({
      stats: stats.set('wrongWords', wrongWords + 1).set('typedWords', typedWords + 1),
    })
  }

  handleCountWords = words => {
    this.setState({
      stats: this.state.stats.set('words', words),
    })
  }

  handleSetActiveChar = char => {
    this.setState({
      activeChar: char,
    })
  }

  handleStart = () => {
    this.setState({ isRunning: true })
  }

  handleFinish = () => {
    this.setState({ isRunning: false, isFinished: true })
  }

  handleRestart = () => {
    this.setState(getInitialState())
  }

  render() {
    const { text } = this.props
    const { stats, activeChar, isRunning, isFinished } = this.state
    const typedWords = stats.get('typedWords')
    const totalWords = stats.get('words')
    // const accuracy = typedWords
    //   ? ((1 - stats.get('wrongWords') / typedWords) * 100).toFixed(2)
    //   : '100.00'
    const progress = totalWords ? typedWords / totalWords : 0

    return (
      <Container>
        <GameLayer isFinished={isFinished}>
          <GameHeader>
            <Typematrix activeChar={activeChar} />
            <GameHeaderRight>
              <Chronos seconds={0.5} isRunning={isRunning} onFinish={this.handleFinish} />
            </GameHeaderRight>
          </GameHeader>

          <ProgressBar progress={progress} />

          <TypeWriter
            text={text}
            isDisabled={isFinished}
            onChar={this.handleSetActiveChar}
            onCorrection={this.handleCorrection}
            onValidateWord={this.handleValidateWord}
            onValidateWrongWord={this.handleValidateWrongWord}
            onCountWords={this.handleCountWords}
            onStart={this.handleStart}
          />
        </GameLayer>
        {isFinished && <FinishBoard onRestart={this.handleRestart} />}
      </Container>
    )
  }
}

export default Game
