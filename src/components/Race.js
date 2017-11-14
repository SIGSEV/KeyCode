import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'
import Star from 'react-icons/lib/go/star'
import Trash from 'react-icons/lib/go/trashcan'

import { getPlayer, getText, startRace, stopRace, resetRace } from 'reducers/race'
import { starText, deleteText } from 'actions/text'
import { saveRace } from 'actions/race'

import LanguageDot from 'components/LanguageDot'
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
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 2rem;
  svg {
    cursor: pointer;
  }

  .left {
    margin-left: auto;
    display: flex;
    align-items: center;
    > * + * {
      margin-left: 0.5rem;
    }
  }

  > * + * {
    margin-left: 1rem;
  }
`

@connect(
  state => ({
    userId: state.user && state.user._id,
    isAdmin: state.user && state.user.admin,
    player: getPlayer(state),
    text: getText(state),
    id: state.race.get('id'),
    title: state.race.get('title'),
    language: state.race.get('language'),
    author: state.race.get('author'),
    rates: state.race.get('rates'),
    stars: state.race.get('stars'),
    isStarted: state.race.get('isStarted'),
    isFinished: state.race.get('isFinished'),
  }),
  {
    starText,
    deleteText,
    startRace,
    stopRace,
    resetRace,
    saveRace,
  },
)
class Race extends PureComponent {
  handleReset = () => {
    this._chronos.reset()
    this.props.resetRace()
  }

  handleStop = () => {
    const { isFinished, stopRace, saveRace } = this.props
    if (isFinished) {
      return
    }

    const time = this._chronos.get()
    stopRace(time)

    saveRace()
  }

  render() {
    const {
      userId,
      isAdmin,
      player,
      language,
      id,
      text,
      title,
      rates,
      author,
      stars,
      isStarted,
      isFinished,
      startRace,
      starText,
      deleteText,
    } = this.props

    const typedChar = player.get('typedChar')
    const typedWordsCount = player.get('typedWordsCount')
    const totalWords = text.get('wordsCount')

    const progress = totalWords ? typedWordsCount / totalWords : 0
    const hasStarred = userId && rates.get(userId)
    const authorID = author && author.get('_id')
    const canEdit = userId === authorID || isAdmin

    return (
      <Wrapper>
        <Container>
          <GameLayer isFinished={isFinished}>
            <RaceTitle>
              <span>{title}</span>
              <span>{player.get('scrollX')}</span>
              <LanguageDot type={language} size="1rem" />
              <div className="left">
                <span>{stars}</span>
                <Star
                  onClick={() => userId && starText(id)}
                  style={{ color: hasStarred ? '#ffb401' : 'lightgrey' }}
                />
                {canEdit && <Trash onClick={() => deleteText(id)} />}
              </div>
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
