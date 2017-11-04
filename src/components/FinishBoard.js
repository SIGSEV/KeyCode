import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'

import Button from 'components/Button'
import Score from 'components/Score'

import { getPlayer } from 'reducers/race'
import { getStats } from 'helpers/race'

const Wrapper = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  overflow: hidden;
  border-radius: 2px;
`

const animEnter = keyframes`
  0% { transform: translate3d(0, 100%, 0); }
  100% { transform: translate3d(0, 0, 0); }
`

const Container = styled.div`
  color: ${p => p.theme.lightgrey02};
  background: ${p => p.theme.darkGrey00};
  position: absolute;
  border-radius: 2px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  will-change: transform;
  animation: ${animEnter} 700ms cubic-bezier(0.78, 0.01, 0.23, 0.97);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > * + * {
    margin-top: 40px;
  }
`

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const statAnim = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, -40px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  opacity: 0;
  will-change: transform;
  animation: ${statAnim} 250ms cubic-bezier(0.39, 1.27, 0.35, 1.14);
  animation-delay: ${p => p.delay * 1000}ms;
  animation-fill-mode: forwards;
`

const StatValue = styled.div`
  font-family: monospace;
  font-size: 36px;
  padding: 10px;
`

const StatLabel = styled.div`
  font-size: 13px;
  text-transform: uppercase;
`

@connect(state => ({
  player: getPlayer(state),
}))
class FinishBoard extends PureComponent {
  state = {
    showScore: false,
  }

  componentDidMount() {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this._restartBtn.focus()
        this.setState({ showScore: true })
      })
    }, 700)
  }

  render() {
    const { onRestart, player } = this.props
    const { showScore } = this.state

    const stats = getStats(player)

    return (
      <Wrapper>
        <Container>
          <div style={{ height: 70 }}>{showScore && <Score score={40} />}</div>

          <StatsContainer>
            <Stat delay={0.6}>
              <StatValue>{stats.wpm}</StatValue>
              <StatLabel>{'WPM'}</StatLabel>
            </Stat>

            <Stat delay={0.7}>
              <StatValue>{stats.wrongWords}</StatValue>
              <StatLabel>{'Wrong words'}</StatLabel>
            </Stat>

            <Stat delay={0.8}>
              <StatValue>{stats.corrections}</StatValue>
              <StatLabel>{'Corrections'}</StatLabel>
            </Stat>
          </StatsContainer>

          <Button accent setRef={n => (this._restartBtn = n)} onClick={onRestart}>
            {'Restart'}
          </Button>
        </Container>
      </Wrapper>
    )
  }
}

export default FinishBoard
