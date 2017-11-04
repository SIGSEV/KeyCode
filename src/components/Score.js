import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'
import styled from 'styled-components'

const ScoreContainer = styled.div`
  color: ${p => p.theme.green};
  font-size: 70px;
  line-height: 70px;
  text-shadow: rgba(0, 0, 0, 0.1) 0 4px 0;
`

class Score extends Component {
  state = {
    score: 0,
  }

  componentDidMount() {
    window.requestAnimationFrame(() => {
      this.setState({ score: this.props.score })
    })
  }

  render() {
    const { score } = this.state
    return (
      <ScoreContainer>
        <Motion
          style={{
            v: spring(score),
          }}
        >
          {m => <div>{Math.round(m.v)}</div>}
        </Motion>
      </ScoreContainer>
    )
  }
}

export default Score
