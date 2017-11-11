import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadLeaders } from 'actions/leaders'

import LeaderCard from 'components/LeaderCard'

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
      <div>
        {leaders.map((leader, i) => (
          <LeaderCard leader={leader} rank={i} disableOpacity key={leader.user.name} />
        ))}
      </div>
    )
  }
}

export default Leaderboard
