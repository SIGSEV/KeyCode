import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import Star from 'react-icons/lib/go/star'
import Trash from 'react-icons/lib/go/trashcan'
import IconLeft from 'react-icons/lib/fa/angle-left'

import { getPlayer, getText, startRace, stopRace, resetRace } from 'reducers/race'
import { starText, deleteText } from 'actions/text'
import { saveRace } from 'actions/race'

import Button from 'components/Button'
import LanguageDot from 'components/LanguageDot'
import TypeWriter from 'components/TypeWriter'
import Typematrix from 'components/Typematrix'
import Chronos from 'components/Chronos'
import ProgressBar from 'components/ProgressBar'
import FinishBoard from 'components/FinishBoard'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: ${p => p.theme.darkGrey00};
  background: ${p => p.theme.lightgrey02};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const RaceHeader = styled.div`
  flex-shrink: 0;
  user-select: none;
  background: ${p => p.theme.darkGrey00};
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  text-shadow: rgba(0, 0, 0, 0.2) 0 1px 0;
`

const RaceTitle = styled.h1`
  padding-right: 10px;
`

const RaceContent = styled.div`
  flex-grow: 1;
  display: flex;
`

const RaceInfos = styled.div`
  flex-grow: 1;
  padding: 20px;
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
    goBack,
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

    window.requestAnimationFrame(async () => {
      try {
        await saveRace()
      } catch (e) {} // eslint-disable-line
    })
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
      goBack,
    } = this.props

    const typedWordsCount = player.get('typedWordsCount')
    const totalWords = text.get('wordsCount')

    const progress = totalWords ? typedWordsCount / totalWords : 0
    const hasStarred = userId && rates.get(userId)
    const authorID = author && author.get('_id')
    const canEdit = userId === authorID || isAdmin

    const chronos = (
      <Chronos
        seconds={5}
        isRunning={isStarted && !isFinished}
        onFinish={this.handleStop}
        ref={n => (this._chronos = n)}
      />
    )

    return (
      <Container>
        <RaceHeader>
          <Button smallPad onClick={goBack}>
            <IconLeft />
            {'Back'}
          </Button>

          <RaceTitle>{title}</RaceTitle>
        </RaceHeader>
        <RaceContent>
          <TypeWriter onStart={startRace} onFinish={this.handleStop} chronos={chronos} />
          <RaceInfos>
            <span>{title}</span>
          </RaceInfos>
        </RaceContent>
        {/*}
        <FinishBoard />
        */}
      </Container>
    )
    return (
      <Container>
        <GameLayer isFinished={isFinished}>
          <RaceTitle>
            <span>{title}</span>
            <LanguageDot type={language} size="1rem" />
            <div className="left">
              <span>{stars}</span>
              <Star
                onClick={() => (userId ? starText(id) : void 0)}
                style={{ color: hasStarred ? '#ffb401' : 'lightgrey' }}
              />
            </div>
          </RaceTitle>

          <GameHeader>
            <GameHeaderRight>
              <Chronos
                seconds={1}
                isRunning={isStarted && !isFinished}
                onFinish={this.handleStop}
                ref={n => (this._chronos = n)}
              />
            </GameHeaderRight>
          </GameHeader>

          <TypeWriter isDisabled={isFinished} onStart={startRace} onFinish={this.handleStop} />
        </GameLayer>

        <FinishBoard />
      </Container>
    )
  }
}

export default Race
