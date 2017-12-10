import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import IconReplay from 'react-icons/lib/md/replay'

import { starText, deleteText } from 'actions/text'
import { loadGhost } from 'actions/race'

import Link from 'components/Link'
import Button from 'components/Button'

const Container = styled.div`
  width: 300px;
  background: ${p => p.theme.lightgrey02};
  border-radius: 3px;
  padding: 20px;

  > * + * {
    margin-top: 20px;
  }
`

const RaceLeaderboard = styled.div``

const SectionTitle = styled.h2`
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
`

@connect(
  state => ({
    userId: state.user && state.user._id,
    race: state.race,
  }),
  {
    starText,
    deleteText,
    loadGhost,
  },
)
class RaceInfos extends PureComponent {
  handleDelete = () => {
    const { deleteText, race } = this.props
    /* eslint-disable no-alert */
    if (confirm('Are you sure?')) {
      /* eslint-enable no-alert */
      deleteText(race.get('id'))
    }
  }
  render() {
    const { race, loadGhost } = this.props

    const leaders = race.get('leaders')

    return (
      <Container>
        {leaders.size ? (
          [
            <SectionTitle key="1">{'Top scores on that race'}</SectionTitle>,
            <RaceLeaderboard key="2">
              {leaders.map((leader, i) => (
                <LeaderEntry
                  key={leader.get('_id')}
                  num={i + 1}
                  leader={leader}
                  loadGhost={loadGhost}
                />
              ))}
            </RaceLeaderboard>,
          ]
        ) : (
          <div>{'No score available yet.'}</div>
        )}
      </Container>
    )
  }
}

const LeaderEntryContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 5px;

  > a + * {
    margin-left: 1rem;
  }
`

const Z = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NumContainer = Z.extend`
  font-weight: bolder;
`

function LeaderEntry({ loadGhost, leader, num }) {
  return (
    <LeaderEntryContainer>
      <NumContainer>{num}</NumContainer>
      <Link to={`/u/${leader.getIn(['user', 'name'])}`}>
        <img src={leader.getIn(['user', 'avatar'])} width={30} />
      </Link>
      {leader.get('log') && (
        <Button action={() => loadGhost(leader)} smallPad noHeight hasloader={0}>
          <IconReplay />
        </Button>
      )}
      <Z style={{ marginLeft: 'auto', width: 60 }}>{leader.get('score')}</Z>
    </LeaderEntryContainer>
  )
}

export default RaceInfos
