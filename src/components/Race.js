import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getPlayer, getText, startRace, stopRace, resetRace } from 'reducers/race'
import { saveRace } from 'actions/race'

import UserOrLogin from 'components/UserOrLogin'
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

const ResetBtn = styled.button`
  opacity: 0;
  width: 0;
  height: 0;
`

@connect(
  state => ({
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
  state = {
    showReset: false,
  }

  handleShowReset = () => this.setState({ showReset: true })
  handleHideReset = () => this.setState({ showReset: false })

  handleReset = () => {
    this.setState({ showReset: false })
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
    const { isStarted, isFinished, startRace, language, title, push } = this.props
    const { showReset } = this.state
    const isRunning = isStarted && !isFinished

    const chronos = (
      <Chronos
        seconds={60}
        isRunning={isRunning}
        onFinish={this.handleStop}
        ref={n => (this._chronos = n)}
      />
    )

    return (
      <Container>
        <RaceHeader>
          <div>
            <Button onClick={() => push('/browse')}>{'/'}</Button>
            <Button onClick={() => push(`/browse?language=${language}`)}>{language}</Button>
          </div>
          <span className="title">{title}</span>
          <UserOrLogin fuckradius="definitely" />
        </RaceHeader>

        <RaceContent>
          <TypeWriter
            innerRef={n => (this._typeWriter = n)}
            onStart={startRace}
            onFinish={this.handleStop}
            chronos={chronos}
            onRestart={this.handleReset}
            showReset={showReset}
          />
          {isRunning && <ResetBtn onFocus={this.handleShowReset} onBlur={this.handleHideReset} />}
          <RaceInfos />
        </RaceContent>
        <FinishBoard onRestart={this.handleReset} />
      </Container>
    )
  }
}

export default Race
