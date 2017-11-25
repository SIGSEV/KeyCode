import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { format } from 'date-fns'
import get from 'lodash/get'
import OffIcon from 'react-icons/lib/fa/power-off'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import {
  LineChart,
  Line,
  CartesianGrid,
  YAxis,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
} from 'recharts'

import { logout, updateUser, loadUser } from 'actions/user'
import { lowerMap, languages } from 'helpers/text'
import { getColor } from 'helpers/colors'
import theme from 'theme'

import Select from 'components/base/Select'
import TypeMatrix from 'components/TypeMatrix'
import LanguageDot from 'components/LanguageDot'
import Button from 'components/Button'

const Container = styled.div`
  display: flex;
  > * + * {
    margin-left: 3rem;
  }
`

const Profile = styled.div`
  max-width: 200px;

  .name {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;

    > span:first-child {
      margin-right: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  > button {
    margin-top: 2rem;
  }
`

const Orgs = styled.div`
  display: flex;
  flex-wrap: wrap;
  > * {
    margin: 0.2rem;
    cursor: pointer;
  }
`

const Main = styled.div`
  flex-grow: 1;

  > div:first-child {
    display: flex;
    align-items: center;
    > * + * {
      margin-left: 3rem;
    }
  }

  > * + * {
    margin-top: 2rem;
  }

  .recharts-text.recharts-cartesian-axis-tick-value {
    font-family: monospace;
  }
`

const Tip = styled.div`
  background-color: white;
  border: 1px solid ${p => p.theme.lightgrey01};
  padding: 1rem;
  display: flex;
  flex-direction: column;

  > span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }
`

const Settings = styled.div`
  margin-top: 2rem;
  > * + * {
    margin-top: 1rem;
  }
`

const Z = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const SubTitle = styled.div`
  text-transform: uppercase;
  font-size: 0.7rem;
`

const keyLayouts = [
  {
    value: 'qwerty',
    label: 'Qwerty',
  },
  {
    value: 'programmerDvorak',
    label: 'Programmer Dvorak',
  },
]

const staggeredOpts = [{ value: true, label: 'Staggered' }, { value: false, label: 'Orthogonal' }]

const getRadarData = user => {
  if (!user || !user.races) {
    return languages.slice(0, 5).map(language => ({ language, score: 0 }))
  }

  const maxs = user.races.reduce((acc, cur) => {
    const prev = acc[cur.language]
    if (!prev || prev.score < cur.score) {
      acc[cur.language] = cur
    }

    return acc
  }, {})

  return Object.keys(maxs).map(l => ({ ...maxs[l], language: lowerMap[l] }))
}

const radarWidth = 200
const radarHeight = 200

const renderTooltip = v => {
  const race = get(v, 'payload[0].payload')
  if (!race) {
    return null
  }

  return (
    <Tip>
      <span>
        {race.score}
        <LanguageDot type={lowerMap[race.language]} size="10px" style={{ marginLeft: '0.5rem' }} />
      </span>
      <span>{format(race.createdAt, 'DD/MM/YY HH:mm')}</span>
    </Tip>
  )
}

@connect(
  ({ users, user }, { match: { params: { name } } }) => ({
    name,
    users,
    loggedUser: user || {},
  }),
  {
    logout,
    loadUser,
    updateUser,
  },
)
class User extends PureComponent {
  componentDidMount() {
    this.load(this.props.name)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.load(nextProps.name)
    }
  }

  load = name => {
    const { users, loadUser } = this.props
    // prevent reload of less than 30secs
    if (!users[name] || !users[name].fetchedAt || Date.now() - users[name].fetchedAt > 1e3 * 30) {
      loadUser(name)
    }
  }

  render() {
    const { users, name, loggedUser, updateUser } = this.props
    const user = users[name] || { name: 'Anon', avatar: 'http://via.placeholder.com/200x200' }
    const isMe = user._id === loggedUser._id
    const radarData = getRadarData(user)

    return (
      <Container>
        <Profile>
          <img src={user.avatar} height={200} />
          <div className="name">
            <span title={user.name}>{user.name}</span>
            {user.admin && (
              <span data-balloon="Almighty admin." data-balloon-pos="up">
                {'🌟'}
              </span>
            )}
            {user.banned && (
              <span data-balloon="Banned." data-balloon-pos="up">
                {'☠'}
              </span>
            )}
          </div>

          {user.orgs && (
            <Orgs>
              {user.orgs.map(org => (
                <a
                  href={`https://github.com/${org.login}`}
                  data-balloon={org.placeholder}
                  data-balloon-pos="up"
                  key={org.login}
                >
                  <img src={org.avatar} height={40} />
                </a>
              ))}
            </Orgs>
          )}

          {isMe && (
            <Settings>
              <Select
                options={keyLayouts}
                value={loggedUser.layout}
                onChange={e => updateUser({ layout: e.target.value })}
              />
              {loggedUser.layout === 'programmerDvorak' && (
                <Select
                  value={loggedUser.staggered}
                  options={staggeredOpts}
                  onChange={e => updateUser({ staggered: e.target.value })}
                />
              )}
              <Button action={() => this.props.logout()} smallPad>
                <OffIcon style={{ marginRight: '0.5rem' }} />
                {'Logout'}
              </Button>
            </Settings>
          )}
        </Profile>

        <Main>
          <div>
            <Z>
              {radarData && (
                <RadarChart
                  outerRadius={80}
                  cx={radarWidth / 2}
                  cy={radarHeight / 2}
                  width={radarWidth}
                  height={radarHeight}
                  data={radarData}
                >
                  <PolarGrid />
                  <Tooltip />
                  <PolarAngleAxis
                    dataKey="language"
                    tick={v => <circle cx={v.x} cy={v.y} r="3" fill={getColor(v.payload.value)} />}
                  />
                  <Radar
                    dataKey="score"
                    stroke={theme.darkGrey03}
                    fill={theme.lightgrey01}
                    fillOpacity={0.5}
                  />
                </RadarChart>
              )}
              <SubTitle>{'Language skill'}</SubTitle>
            </Z>

            <Z>
              <Z style={{ height: radarHeight }}>
                <TypeMatrix
                  wrongKeys={user.wrongKeys}
                  layout={isMe ? loggedUser.layout : user.layout}
                  staggered={isMe ? loggedUser.staggered : user.staggered}
                />
              </Z>
              <SubTitle>{'Typos heatmap'}</SubTitle>
            </Z>
          </div>

          <AutoSizer disableHeight>
            {({ width }) => (
              <LineChart
                width={width}
                height={300}
                data={user.races}
                margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
              >
                <YAxis axisLine={false} tickSize={20} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip content={renderTooltip} />
                <Line
                  dot={({ payload, dataKey, ...rest }) => (
                    <circle key={dataKey} {...rest} stroke={getColor(lowerMap[payload.language])} />
                  )}
                  activeDot={({ payload, dataKey, ...rest }) => (
                    <circle key={dataKey} {...rest} fill={getColor(lowerMap[payload.language])} />
                  )}
                  dataKey={v => v.score}
                  isAnimationActive={false}
                  stroke={'transparent'}
                />
              </LineChart>
            )}
          </AutoSizer>
        </Main>
      </Container>
    )
  }
}

export default User
