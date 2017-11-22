import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getPlayer, getText, startRace, stopRace, resetRace } from 'reducers/race'
import { saveRace } from 'actions/race'

import UserPic from 'components/UserPic'
import Button from 'components/Button'
import TypeWriter from 'components/TypeWriter'
import Chronos from 'components/Chronos'
import FinishBoard from 'components/FinishBoard'
import RaceInfos from 'components/RaceInfos'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: ${p => p.theme.darkGrey00};
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

  .title {
    text-transform: uppercase;
    font-size: 10px;
  }
`

const RaceContent = styled.div`
  flex-grow: 1;
  display: flex;
`

@connect(
  state => ({
    user: state.user,
    userId: state.user && state.user._id,
    isAdmin: state.user && state.user.admin,
    player: getPlayer(state),
    text: getText(state),
    language: state.race.get('language').toLowerCase(),
    title: state.race.get('title'),
    isStarted: state.race.get('isStarted'),
    isFinished: state.race.get('isFinished'),
  }),
  {
    startRace,
    stopRace,
    resetRace,
    saveRace,
    push,
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
    const log = this._typeWriter.getCompressedLog()

    stopRace({ time, log })

    window.requestAnimationFrame(async () => {
      try {
        await saveRace()
      } catch (e) {} // eslint-disable-line
    })
  }

  render() {
    const { isStarted, isFinished, startRace, language, title, user, push } = this.props

    const chronos = (
      <Chronos
        seconds={60}
        isRunning={isStarted && !isFinished}
        onFinish={this.handleStop}
        ref={n => (this._chronos = n)}
      />
    )

    return (
      <Container>
        <RaceHeader>
          <div>
            <Button onClick={() => push('/')}>{'/'}</Button>
            <Button onClick={() => push(`/l/${language}`)}>{language}</Button>
          </div>
          <span className="title">{title}</span>
          <UserPic to="/u/toto" pic={user.avatar} fuckradius="yes" />
        </RaceHeader>

        <RaceContent>
          <TypeWriter
            innerRef={n => (this._typeWriter = n)}
            onStart={startRace}
            onFinish={this.handleStop}
            chronos={chronos}
          />
          <RaceInfos />
        </RaceContent>
        <FinishBoard onRestart={this.handleReset} />
      </Container>
    )
  }
}

export default Race
