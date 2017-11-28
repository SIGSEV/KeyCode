import React, { Component } from 'react'
import { push } from 'react-router-redux'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { loadTexts } from 'actions/text'
import { languages } from 'helpers/text'

import Box from 'components/base/Box'
import TextCard from 'components/TextCard'

const LanguageFilter = styled.div`
  cursor: pointer;
  padding: 10px;
  border: 1px solid transparent;
  outline: none;

  background: ${p => (p.isActive ? 'rgba(0, 0, 0, 0.05)' : '')};
  font-weight: ${p => (p.isActive ? 'bold' : '')};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:active {
    background: rgba(0, 0, 0, 0.1);
  }

  &:focus {
    border-color: rgba(0, 0, 0, 0.1);
  }
`

@connect(({ texts }) => ({ texts: texts.get('browse') }), {
  loadTexts,
  push,
})
class Browse extends Component {
  state = {
    activeLanguage: null,
  }

  componentWillMount() {
    if (__BROWSER__) {
      const query = new URLSearchParams(location.search)
      const language = query.get('language') || undefined
      if (language) {
        this.setState({ activeLanguage: language })
      }
    }
  }

  componentDidMount() {
    const { texts } = this.props
    if (texts.size) {
      return
    }

    window.requestAnimationFrame(this.search)
  }

  search = async () => {
    const { location, loadTexts } = this.props
    const query = new URLSearchParams(location.search)
    const language = query.get('language') || undefined
    await loadTexts({ language, limit: 100 })

    if (language) {
      this.setState({ activeLanguage: language })
    }
  }

  addFilter = async (name, val) => {
    const { push } = this.props
    const query = new URLSearchParams(location.search)
    query.set(name, val.toLowerCase())
    await push(`?${query.toString()}`)
    this.search()
  }

  render() {
    const { activeLanguage } = this.state
    const { texts } = this.props
    return (
      <Box horizontal flow={20}>
        <Box style={{ width: 200 }}>
          {languages.map(l => (
            <LanguageFilter
              tabIndex={0}
              key={l}
              onClick={() => this.addFilter('language', l)}
              isActive={l.toLowerCase() === activeLanguage}
            >
              {l}
            </LanguageFilter>
          ))}
        </Box>
        <Box>{texts.map(text => <TextCard text={text} key={text.get('id')} />)}</Box>
      </Box>
    )
  }
}

export default Browse
