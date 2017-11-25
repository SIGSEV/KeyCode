import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import IconStar from 'react-icons/lib/md/star'
import IconReplay from 'react-icons/lib/md/replay'

import { starText, deleteText } from 'actions/text'
import { ghostRace } from 'actions/race'

import Link from 'components/Link'
import Button from 'components/Button'
import LanguageDot from 'components/LanguageDot'

const Container = styled.div`
  flex-grow: 1;
  padding: 20px;
  background: ${p => p.theme.lightgrey02};

  > * + * {
    margin-top: 40px;
  }
`

const RaceTitle = styled.h1`
  font-size: 24px;
  line-height: 36px;
  font-weight: bold;
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 10px;
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

@connect(
  state => ({
    userId: state.user && state.user._id,
    isAdmin: state.user && state.user.admin,
    race: state.race,
  }),
  {
    starText,
    deleteText,
    ghostRace,
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
    const { userId, isAdmin, starText, race, ghostRace } = this.props

    const author = race.get('author')
    const rates = race.get('rates')
    const language = race.get('language')
    const stars = race.get('stars')
    const hasStarred = userId && rates.get(userId)
    const authorID = author && author.get('_id')
    const canEdit = userId === authorID || isAdmin
    const text = race.get('text')
    const leaders = race.get('leaders')

    return (
      <Container>
        <div>
          <RaceTitle>
            <span>{race.get('title')}</span>
            <LanguageDot type={language} size="15px" style={{ marginTop: 3 }} />
          </RaceTitle>

          <RaceMetas>
            <Meta
              interactive
              tabIndex={0}
              onClick={() => (userId ? starText(race.get('id')) : void 0)}
            >
              <IconStar style={{ color: hasStarred ? '#ffb401' : void 0 }} />
              <span>{stars}</span>
            </Meta>
            <Meta>
              <b>{text.get('wordsCount')}</b>
              &nbsp;{'words'}
            </Meta>
            <Meta>
              {'Difficulty:'}&nbsp;
              <b>{'medium'}</b>
            </Meta>
            {canEdit && (
              <Meta interactive tabIndex={0} danger onClick={this.handleDelete}>
                {'Delete'}
              </Meta>
            )}
          </RaceMetas>
        </div>
        {leaders.size ? (
          <RaceLeaderboard>
            {leaders.map((leader, i) => (
              <LeaderEntry
                key={leader.get('_id')}
                num={i + 1}
                leader={leader}
                ghostRace={ghostRace}
              />
            ))}
          </RaceLeaderboard>
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

function LeaderEntry({ ghostRace, leader, num }) {
  return (
    <LeaderEntryContainer>
      <NumContainer>{num}</NumContainer>
      <Link to={`/u/${leader.getIn(['user', 'name'])}`}>
        <img src={leader.getIn(['user', 'avatar'])} width={30} />
      </Link>
      {leader.get('log') && (
        <Button action={() => ghostRace(leader.get('log'))} smallPad noHeight hasloader={0}>
          <IconReplay />
        </Button>
      )}
      <Z style={{ marginLeft: 'auto', width: 60 }}>{leader.get('score')}</Z>
    </LeaderEntryContainer>
  )
}

export default RaceInfos
