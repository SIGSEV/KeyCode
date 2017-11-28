import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'

import { openModal, closeModal } from 'reducers/modals'

import Modal from 'components/Modal'
import Button from 'components/Button'
import Score from 'components/Score'

import { getPlayer } from 'reducers/race'
import getScore from 'helpers/getScore'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > * + * {
    margin-top: 30px;
  }
`

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ScoreContainer = styled.div`
  text-align: center;
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
  width: 190px;

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
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
`

@connect(
  state => ({
    player: getPlayer(state),
    isFinished: !state.race.get('isGhosting') && state.race.get('isFinished'),
  }),
  {
    openModal,
    closeModal,
  },
)
class FinishBoard extends PureComponent {
  state = {
    showScore: false,
  }

  componentDidUpdate(prevProps) {
    const { isFinished, openModal, closeModal } = this.props
    if (isFinished && !prevProps.isFinished) {
      window.requestAnimationFrame(() => {
        openModal('finishBoard')
        this.setState({ showScore: true })
      })
    }

    if (!isFinished && prevProps.isFinished) {
      closeModal('finishBoard')
    }
  }

  render() {
    const { onRestart, player } = this.props
    const { showScore } = this.state

    const score = getScore(player.toJS())

    return (
      <Modal name="finishBoard" onClose={onRestart}>
        <Wrapper>
          <ScoreContainer style={{ height: 70 }}>
            {showScore && <Score score={score.score} />}
          </ScoreContainer>

          <StatsContainer>
            <Stat delay={0.6}>
              <StatValue>{score.wpm}</StatValue>
              <StatLabel>{'WPM'}</StatLabel>
            </Stat>

            <Stat delay={0.7}>
              <StatValue>{score.wrongWordsCount}</StatValue>
              <StatLabel>{'Wrong words'}</StatLabel>
            </Stat>
          </StatsContainer>

          <Button accent onClick={onRestart}>
            {'Restart'}
          </Button>
        </Wrapper>
      </Modal>
    )
  }
}

export default FinishBoard
