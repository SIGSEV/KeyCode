import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import IconLeft from 'react-icons/lib/fa/angle-left'

import { getPlayer, getText, startRace, stopRace, resetRace } from 'reducers/race'
import { saveRace } from 'actions/race'

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
`

const RaceContent = styled.div`
  flex-grow: 1;
  display: flex;
`

@connect(
  state => ({
    userId: state.user && state.user._id,
    isAdmin: state.user && state.user.admin,
    player: getPlayer(state),
    text: getText(state),
    isStarted: state.race.get('isStarted'),
    isFinished: state.race.get('isFinished'),
  }),
  {
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
    const { isStarted, isFinished, startRace, goBack } = this.props

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
          <Button smallPad onClick={goBack}>
            <IconLeft />
            {'Back'}
          </Button>
        </RaceHeader>

        <RaceContent>
          <TypeWriter onStart={startRace} onFinish={this.handleStop} chronos={chronos} />
          <RaceInfos />
        </RaceContent>
        <FinishBoard onRestart={this.handleReset} />
      </Container>
    )
  }
}

export default Race
