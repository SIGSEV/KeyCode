import React, { PureComponent } from 'react'
import IconRecord from 'react-icons/lib/md/adjust'
import IconFinished from 'react-icons/lib/fa/flag-checkered'
import IconWaiting from 'react-icons/lib/md/timer'
import IconWrong from 'react-icons/lib/fa/close'
import IconWarn from 'react-icons/lib/fa/exclamation-triangle'
import IconGhost from 'react-icons/lib/md/airplay'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getTextColor } from 'helpers/colors'
import { getPlayer } from 'reducers/race'

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
    icon: <IconFinished />,
    text: 'Finished',
    color: 'blue',
  },
  ghosting: {
    icon: <IconGhost />,
    text: 'Ghosting',
    color: 'green',
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

const Right = styled.div`
  margin-left: auto;
  display: flex;
`

const Info = styled.div`
  padding: 0 10px;
  display: flex;
  align-items: center;
  background-color: ${p => (p.dark ? 'rgba(0, 0, 0, 0.1)' : '')};
  color: ${p => (p.color ? p.theme[p.color] : '')};

  > * + * {
    margin-left: 5px;
  }
`

const Status = Info.extend`
  background-color: ${p => p.theme[statuses[p.status].color]};
  color: ${p => getTextColor(p.theme[statuses[p.status].color])};
  text-transform: uppercase;
  font-weight: bold;
`

@connect(state => ({
  player: getPlayer(state),
  isStarted: state.race.get('isStarted'),
  isFinished: state.race.get('isFinished'),
  isGhosting: state.race.get('isGhosting'),
}))
class StatusBar extends PureComponent {
  render() {
    const { children, isStarted, isFinished, isGhosting, player } = this.props
    const wrongWordsCount = player.get('wrongWordsCount')
    const correctionsCount = player.get('corrections')
    const status = isFinished
      ? 'finished'
      : isGhosting ? 'ghosting' : isStarted ? 'recording' : 'waiting'

    return (
      <Container>
        <Status status={status}>
          {statuses[status].icon}
          <span>{statuses[status].text}</span>
        </Status>
        {children && <Info>{children}</Info>}
        <Right>
          {!!correctionsCount && (
            <Info color="orange">
              <IconWarn />
              <span>{correctionsCount}</span>
            </Info>
          )}

          {!!wrongWordsCount && (
            <Info color="red" dark>
              <IconWrong />
              <span>{wrongWordsCount}</span>
            </Info>
          )}
        </Right>
      </Container>
    )
  }
}

export default StatusBar
