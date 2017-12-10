import React, { Component } from 'react'
import styled from 'styled-components'

import { romanize } from 'helpers/text'

const Container = styled.div`
  height: 200px;
  padding: 1rem;

  .rank {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${p => p.theme.darkGrey02};
    color: white;
    font-family: monospace;
    padding: 0.2rem;
    border-radius: 3px;
    margin-left: 0.5rem;
  }

  > div {
    display: flex;
    align-items: flex-start;
  }

  > * + * {
    margin-top: 0.5rem;
  }
`

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  font-size: 0.7rem;
`

const meta = {
  racer: {
    title: 'Racer',
    desc: 'Score streak of 80+',
  },
  perfect: {
    title: 'Mr. Perfect',
    desc: 'Score streak of 70+ without typos',
  },
  god: {
    title: 'God',
    desc: 'Score streak of 70+ without typos & restart',
  },
  galvanizer: {
    title: 'Galvanizer',
    desc: 'First of a text with 100+ runs && 10+ users',
  },
}

class Achievements extends Component {
  render() {
    const { data } = this.props

    if (!data) {
      return null
    }

    return (
      <Container>
        {Object.keys(data).map(k => (
          <div
            className="hint--left hint--no-animate"
            aria-label={`${meta[k].title} - ${meta[k].desc}`}
            key={k}
          >
            <Stats>
              <progress
                max={data[k].value + (3 - data[k].value % 3)}
                value={data[k].cur || data[k].value}
              />
              {`${data[k].cur || data[k].value}/${data[k].value + (3 - data[k].value % 3)}`}
            </Stats>
            <div className="rank">
              {meta[k].title} {romanize(data[k].value / 3) || '-'}
            </div>
          </div>
        ))}
      </Container>
    )
  }
}

export default Achievements
