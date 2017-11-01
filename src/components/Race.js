import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'

import { getPlayer, startRace, stopRace, resetRace } from 'reducers/race'

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
    typedChar: getPlayer(state).get('typedChar'),
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
  render() {
    const { typedChar, isStarted, isFinished, startRace, stopRace, resetRace } = this.props
    // const typedWords = stats.get('typedWords')
    // const totalWords = stats.get('words')
    // const accuracy = typedWords
    //   ? ((1 - stats.get('wrongWords') / typedWords) * 100).toFixed(2)
    //   : '100.00'
    // const progress = totalWords ? typedWords / totalWords : 0

    return (
      <Wrapper>
        <Container>
          <GameLayer isFinished={isFinished}>
            <GameHeader>
              <Typematrix activeChar={typedChar} />
              <GameHeaderRight>
                <Chronos seconds={6} isRunning={isStarted} onFinish={stopRace} />
              </GameHeaderRight>
            </GameHeader>

            <ProgressBar progress={0.4} />

            <TypeWriter isDisabled={isFinished} onStart={startRace} />
          </GameLayer>

          {isFinished && <FinishBoard onRestart={resetRace} />}
        </Container>
      </Wrapper>
    )
  }
}

export default Race
