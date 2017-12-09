import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import IconStar from 'react-icons/lib/md/star'
import IconReplay from 'react-icons/lib/md/replay'

import { starText, deleteText } from 'actions/text'
import { loadGhost } from 'actions/race'

import Link from 'components/Link'
import Button from 'components/Button'

const Container = styled.div`
  width: 300px;

  > * + * {
    margin-top: 20px;
  }
`

const RaceMetas = styled.div`
  font-size: 12px;
  display: flex;
  margin-left: -5px;

  > *:first-child,
  > *:last-child {
    cursor: pointer;
  }

  > * + * {
    margin-left: 5px;
  }
`

const Meta = styled.div`
  height: 20px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  cursor: default;
  user-select: none;
  border: 1px dashed transparent;
  color: ${p => (p.danger ? p.theme.red : '')};

  > * + * {
    margin-left: 3px;
  }

  &:hover {
    background-color: ${p => (p.interactive ? 'rgba(0, 0, 0, 0.05)' : '')};
  }

  &:active {
    background-color: ${p => (p.interactive ? 'rgba(0, 0, 0, 0.1)' : '')};
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 0, 0, 0.1);
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
    const { userId, starText, race, loadGhost } = this.props

    const rates = race.get('rates')
    const stars = race.get('stars')
    const hasStarred = userId && rates.get(userId)
    const leaders = race.get('leaders')

    return (
      <Container>
        <RaceMetas>
          <Meta
            interactive
            tabIndex={0}
            onClick={() => (userId ? starText(race.get('id')) : void 0)}
          >
            <IconStar style={{ color: hasStarred ? '#ffb401' : void 0 }} />
            <span>{stars}</span>
          </Meta>
        </RaceMetas>
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
