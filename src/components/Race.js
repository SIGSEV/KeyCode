import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'

import { getPlayer, getText, startRace, stopRace, resetRace } from 'reducers/race'

import TypeWriter from 'components/TypeWriter'
import Typematrix from 'components/Typematrix'
import Chronos from 'components/Chronos'
import ProgressBar from 'components/ProgressBar'
import FinishBoard from 'components/FinishBoard'

const Wrapper = styled.div`
  max-width: 860px;
  margin: 0 auto;
`

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

@connect(
  state => ({
    player: getPlayer(state),
    text: getText(state),
    isStarted: state.race.get('isStarted'),
    isFinished: state.race.get('isFinished'),
  }),
  {
    startRace,
    stopRace,
    resetRace,
  },
)
class Race extends PureComponent {
  handleReset = () => {
    this._chronos.reset()
    this.props.resetRace()
  }

  handleStop = () => {
    const time = this._chronos.get()
    this.props.stopRace(time)
  }

  render() {
    const { player, text, isStarted, isFinished, startRace } = this.props

    const typedChar = player.get('typedChar')
    const typedWordsCount = player.get('typedWordsCount')
    const totalWords = text.get('wordsCount')

    // const accuracy = typedWords
    //   ? ((1 - stats.get('wrongWords') / typedWords) * 100).toFixed(2)
    //   : '100.00'

    const progress = totalWords ? typedWordsCount / totalWords : 0

    return (
      <Wrapper>
        <Container>
          <GameLayer isFinished={isFinished}>
            <GameHeader>
              <Typematrix activeChar={typedChar} />
              <GameHeaderRight>
                <Chronos
                  seconds={60}
                  isRunning={isStarted && !isFinished}
                  onFinish={this.handleStop}
                  ref={n => (this._chronos = n)}
                />
              </GameHeaderRight>
            </GameHeader>

            <ProgressBar progress={progress} />

            <TypeWriter isDisabled={isFinished} onStart={startRace} onFinish={this.handleStop} />
          </GameLayer>

          {isFinished && <FinishBoard onRestart={this.handleReset} />}
        </Container>
      </Wrapper>
    )
  }
}

export default Race
