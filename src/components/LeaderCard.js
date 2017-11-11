import React, { Component } from 'react'
import styled from 'styled-components'
import TextIcon from 'react-icons/lib/go/gist'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { loadRace } from 'actions/race'
import { lowerMap } from 'helpers/text'
import { getColor, getTextColor, hexToRGB } from 'helpers/colors'

const Container = styled.div`
  display: flex;
  min-width: 10rem;
  margin: 0.5rem;

  cursor: pointer;
  text-decoration: none;
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.05);

  .rank {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    color: ${p => getTextColor(getColor(p.lang))};
    background-color: ${p => hexToRGB(getColor(p.lang), p.disableOpacity ? 1 : 1 - p.rank * 0.05)};

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      transition: opacity 100ms ease-in;
      opacity: 0;
    }
  }

  &:hover {
    box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.15);
    .rank img {
      opacity: 1;
    }
  }
`

const Main = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 0 1rem;

  > div {
    padding: 0.5rem;
    margin: 0;
    &:hover {
      color: ${p => p.theme.blue};
    }
  }

  svg {
    display: flex;
    align-items: center;
  }

  > * + * {
    margin-left: 0.5rem;
  }
`

@connect(null, {
  push,
  loadRace,
})
class LeaderCard extends Component {
  openUser = e => {
    const { leader, push } = this.props
    const url = `/u/${leader.user.name}`
    const spe = e.shiftKey || e.metaKey
    if (spe) {
      return window.open(url)
    }

    push(url)
  }

  openRace = async e => {
    const { leader, loadRace, push } = this.props

    e.preventDefault()
    e.stopPropagation()
    const url = `/r/${leader.text.id}`
    const spe = e.shiftKey || e.metaKey

    if (spe) {
      return window.open(url)
    }

    await loadRace(leader.text.id)
    push(url)
  }

  render() {
    const { leader, rank, disableOpacity } = this.props

    if (!leader) {
      return null
    }

    return (
      <Container
        onClick={this.openUser}
        lang={lowerMap[leader.language]}
        rank={rank}
        disableOpacity={disableOpacity}
      >
        <div className="rank">
          <span>{rank + 1}</span>
          <img src={leader.user.avatar} width={30} />
        </div>
        <Main>
          <span>{leader.user.name}</span>
          <b>{leader.score}</b>
          <div onClick={this.openRace}>
            <TextIcon />
          </div>
        </Main>
      </Container>
    )
  }
}

export default LeaderCard
