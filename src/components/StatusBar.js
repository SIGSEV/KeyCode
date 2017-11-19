import React, { PureComponent } from 'react'
import IconRecord from 'react-icons/lib/md/adjust'
import IconWaiting from 'react-icons/lib/md/timer'
import styled from 'styled-components'
import { connect } from 'react-redux'

const statuses = {
  waiting: {
    icon: <IconWaiting />,
    text: 'Waiting',
    color: 'lightgrey00',
  },
  recording: {
    icon: <IconRecord />,
    text: 'Recording',
    color: 'red',
  },
  finished: {
    icon: <IconWaiting />,
    text: 'Finished',
    color: 'blue',
  },
}

const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 24px;
  font-size: 12px;
  background: ${p => p.theme.darkGrey03};
  display: flex;
  color: white;
  text-shadow: rgba(0, 0, 0, 0.2) 0 1px 0;
`

const Info = styled.div`
  padding: 0 10px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
`

const Status = Info.extend`
  background: ${p => p.theme[statuses[p.status].color]};
  font-weight: bold;

  > * + * {
    margin-left: 5px;
  }
`

@connect(state => ({
  isStarted: state.race.get('isStarted'),
  isFinished: state.race.get('isFinished'),
}))
class StatusBar extends PureComponent {
  render() {
    const { isStarted, isFinished } = this.props
    const status = isStarted ? 'recording' : isFinished ? 'finished' : 'waiting'
    return (
      <Container>
        <Status status={status}>
          {statuses[status].icon}
          <span>{statuses[status].text}</span>
        </Status>
        <Info>{'L5'}</Info>
      </Container>
    )
  }
}

export default StatusBar
