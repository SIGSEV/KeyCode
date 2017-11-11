import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getColor } from 'helpers/colors'
import { lowerMap } from 'helpers/text'

import TextCard from 'components/TextCard'

const Container = styled.div`
  > * + * {
    margin-top: 2rem;
  }
`

const Title = styled.h2`
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 3px solid ${p => getColor(p.type)};
  padding-bottom: 0.2rem;
`

const SubTitle = styled.div`
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
`

@connect(({ texts }, { match: { params: { id } } }) => ({
  texts: texts.getIn(['languages', id], []),
}))
class Language extends PureComponent {
  render() {
    const { texts, match: { params: { id } } } = this.props
    const realLang = lowerMap[id]

    return (
      <Container>
        <Title type={realLang}>{id}</Title>
        <SubTitle>{'Leaderboard'}</SubTitle>
        <SubTitle>{'Races'}</SubTitle>
        <div>{texts.map(text => <TextCard text={text} hideLang key={text.get('id')} />)}</div>
      </Container>
    )
  }
}

export default Language
