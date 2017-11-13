import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { loadLeaders } from 'actions/leaders'

import LeaderCard from 'components/LeaderCard'

const Container = styled.div`
  > * + * {
    margin-top: 1.5rem;
  }
`

@connect(({ leaders: { global } }) => ({ leaders: global }), {
  loadLeaders,
})
class Leaderboard extends Component {
  componentDidMount() {
    if (!this.props.leaders.length) {
      this.props.loadLeaders()
    }
  }

  render() {
    const { leaders } = this.props

    return (
      <Container>
        {leaders.map((leader, i) => (
          <LeaderCard leader={leader} rank={i} disableOpacity key={leader.user.name} />
        ))}
      </Container>
    )
  }
}

export default Leaderboard
