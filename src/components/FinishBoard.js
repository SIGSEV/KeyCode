import React, { PureComponent } from 'react'
import styled, { keyframes } from 'styled-components'

import Button from 'components/Button'

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

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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

class FinishBoard extends PureComponent {
  componentDidMount() {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this._restartBtn.focus()
      })
    }, 700)
  }

  render() {
    const { onRestart } = this.props
    return (
      <Wrapper>
        <Container>
          <StatsContainer>
            <Stat delay={1}>
              <StatValue>{'84'}</StatValue>
              <StatLabel>{'WPM'}</StatLabel>
            </Stat>

            <Stat delay={2}>
              <StatValue>{'0'}</StatValue>
              <StatLabel>{'Wrong words'}</StatLabel>
            </Stat>

            <Stat delay={3}>
              <StatValue>{'0'}</StatValue>
              <StatLabel>{'Corrections'}</StatLabel>
            </Stat>
          </StatsContainer>

          <Button accent ref={n => (this._restartBtn = n)} onClick={onRestart}>
            {'Restart'}
          </Button>
        </Container>
      </Wrapper>
    )
  }
}

export default FinishBoard
