import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getPlayer, getText, stopRace, resetRace } from 'reducers/race'
import { startRace, saveRace } from 'actions/race'

import Box from 'components/base/Box'
import Link from 'components/Link'
import UserOrLogin from 'components/UserOrLogin'
import RaceFunnel from 'components/RaceFunnel'
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: ${p => p.theme.darkGrey00};
  padding: 40px;

  > * + * {
    margin-top: 40px;
  }
`

const RaceHeader = styled.div`
  flex-shrink: 0;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

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
    player: getPlayer(state),
    text: getText(state),
    race: state.race,
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
    this._typeWriter.resetLog()
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
    const { isStarted, isFinished, startRace } = this.props
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
          <RaceFunnel />
          <Box horizontal align="center" flow={40}>
            <Link to="/leaderboard">{'LeaderBoard'}</Link>
            <UserOrLogin />
          </Box>
        </RaceHeader>

        <RaceContent>
          <RaceInfos />
          <TypeWriter
            innerRef={n => (this._typeWriter = n)}
            onStart={startRace}
            onFinish={this.handleStop}
            chronos={chronos}
            onRestart={this.handleReset}
          />
        </RaceContent>
        <FinishBoard onRestart={this.handleReset} />
      </Container>
    )
  }
}

export default Race
