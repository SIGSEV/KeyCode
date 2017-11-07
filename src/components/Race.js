import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'
import Star from 'react-icons/lib/go/star'

import { getPlayer, getText, startRace, stopRace, resetRace } from 'reducers/race'
import { starText } from 'actions/text'

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

const RaceTitle = styled.div`
  margin-bottom: 1rem;
  font-size: 2rem;
  svg {
    cursor: pointer;
  }

  > * + * {
    margin-left: 0.5rem;
  }
`

@connect(
  state => ({
    userId: state.user && state.user._id,
    player: getPlayer(state),
    text: getText(state),
    id: state.race.get('id'),
    title: state.race.get('title'),
    rates: state.race.get('rates'),
    stars: state.race.get('stars'),
    isStarted: state.race.get('isStarted'),
    isFinished: state.race.get('isFinished'),
  }),
  {
    starText,
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
    const {
      player,
      id,
      text,
      title,
      rates,
      userId,
      stars,
      isStarted,
      isFinished,
      startRace,
      starText,
    } = this.props

    const typedChar = player.get('typedChar')
    const typedWordsCount = player.get('typedWordsCount')
    const totalWords = text.get('wordsCount')

    // const accuracy = typedWords
    //   ? ((1 - stats.get('wrongWords') / typedWords) * 100).toFixed(2)
    //   : '100.00'

    const progress = totalWords ? typedWordsCount / totalWords : 0
    const hasStarred = userId && rates.get(userId)

    return (
      <Wrapper>
        <Container>
          <GameLayer isFinished={isFinished}>
            <RaceTitle>
              <span>{title}</span>
              <Star
                onClick={() => userId && starText(id)}
                style={{ color: hasStarred ? '#ffb401' : 'lightgrey' }}
              />
              <span>({stars})</span>
            </RaceTitle>
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
