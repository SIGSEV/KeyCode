import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { loadLeaders } from 'actions/leaders'
import { lowerMap } from 'helpers/text'

import LeaderCard from 'components/LeaderCard'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  > * {
    margin-top: 1rem;
  }
`

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;

  .title {
    text-transform: uppercase;
    font-size: 12px;
  }
`

const Board = ({ name, leaders }) =>
  !!leaders && (
    <BoardContainer>
      <div className="title">{name}</div>
      {leaders.map((leader, i) => (
        <LeaderCard
          leader={leader}
          rank={i}
          disableOpacity={name === 'Global'}
          key={leader.user.name}
        />
      ))}
    </BoardContainer>
  )

@connect(
  ({ leaders }) => ({
    leaders: Object.keys(leaders)
      .filter(k => leaders[k].length)
      .reduce((acc, k) => ((acc[k] = leaders[k]), acc), {}),
  }),
  {
    loadLeaders,
  },
)
class Leaderboard extends Component {
  componentDidMount() {
    this.props.loadLeaders()
  }

  render() {
    const { leaders } = this.props

    return (
      <Container>
        <Board name="Global" leaders={leaders.global} />

        {Object.keys(leaders)
          .filter(k => k !== 'global')
          .map(l => <Board key={l} name={lowerMap[l]} leaders={leaders[l]} />)}
      </Container>
    )
  }
}

export default Leaderboard
