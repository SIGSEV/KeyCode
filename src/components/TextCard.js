import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import Star from 'react-icons/lib/go/star'

import { loadRace } from 'actions/race'

import LanguageDot from 'components/LanguageDot'

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  height: 6rem;
  position: relative;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  img {
    border-radius: 50%;
    width: 30px;
  }

  a {
    text-decoration: none;
    &:hover {
      color: ${p => p.theme.blue};
    }
  }

  & + * {
    margin-top: 0.5rem;
  }
`

const Main = styled.div`
  .author {
    display: flex;
    align-items: center;

    * + * {
      margin-left: 0.4rem;
    }
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  margin-bottom: 0.7rem;

  > span:first-child {
    font-weight: bold;
  }

  * + * {
    margin-left: 0.5rem;
  }
`

const Leaders = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  min-width: 10rem;
  padding: 0 4rem;
`

const Stars = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  font-size: 20px;
  flex-shrink: 0;

  svg {
    color: #ffb401;
  }

  * + * {
    margin-left: 0.3rem;
  }
`

const placeloader = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: 0 0; }
`

const Loader = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: ${placeloader} 1s linear infinite;
  background: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.25) 100%);
  background-size: 200%;
`

@connect(null, {
  loadRace,
  push,
})
class TextCard extends Component {
  static defaultProps = {
    hideLang: false,
  }

  state = {
    loading: false,
  }

  componentWillUnmount() {
    this._unmounted = true
  }

  safeSetState = (...args) => {
    if (this._unmounted) {
      return
    }
    this.setState(...args)
  }

  load = async e => {
    const { text, loadRace, push } = this.props
    const { loading } = this.state
    if (loading) {
      return
    }

    const id = text.get('id')
    const url = `/r/${id}`
    const spe = e.shiftKey || e.metaKey
    if (spe) {
      return window.open(url)
    }

    this.safeSetState({ loading: true })
    await loadRace(id)
    this.safeSetState({ loading: false })
    push(url)
  }

  prevent = e => e.stopPropagation()

  render() {
    const { loading } = this.state
    const { text, hideLang } = this.props
    const language = text.get('language')

    return (
      <Container onClick={this.load}>
        {loading && <Loader />}

        <Main>
          <Title>
            <span>{text.get('title')}</span>
            {!hideLang && <LanguageDot type={language} />}
            {!hideLang && <span>{language}</span>}
          </Title>

          <Link
            onClick={this.prevent}
            to={`/u/${text.getIn(['author', 'name'])}`}
            className="author"
          >
            <div>
              <img src={text.getIn(['author', 'avatar'])} />
            </div>
            <span>{text.getIn(['author', 'name'])}</span>
          </Link>
        </Main>

        <Leaders>
          {text.get('leaders').map((leader, i) => (
            <Link
              data-balloon={`${i + 1}. ${leader.getIn(['user', 'name'])} - ${leader.get('score')}`}
              data-balloon-pos="up"
              onClick={this.prevent}
              to={`/u/${leader.getIn(['user', 'name'])}`}
              key={leader.getIn(['user', 'name'])}
            >
              <img src={leader.getIn(['user', 'avatar'])} />
            </Link>
          ))}
        </Leaders>

        <Stars>
          <span>{text.get('stars')}</span>
          <Star />
        </Stars>
      </Container>
    )
  }
}

export default TextCard
