import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getColor } from 'helpers/colors'
import { lowerMap } from 'helpers/text'
import { loadTexts } from 'actions/text'
import { loadLeaders } from 'actions/leaders'

import TextCard from 'components/TextCard'
import LeaderCard from 'components/LeaderCard'

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

const Leaders = styled.div`
  display: flex;
  flex-wrap: wrap;

  > * {
    min-width: 15rem;
    flex-grow: 1;
    flex-basis: 0;
  }
`

@connect(
  ({ texts, leaders }, { match: { params: { id } } }) => ({
    texts: texts.getIn(['languages', id], []),
    leaders: leaders.languages[id] || [],
  }),
  {
    loadTexts,
    loadLeaders,
  },
)
class Language extends PureComponent {
  componentDidMount() {
    const { loadTexts, loadLeaders, match: { params: { id } } } = this.props
    loadTexts(id)
    loadLeaders(id)
  }

  render() {
    const { texts, leaders, match: { params: { id } } } = this.props
    const realLang = lowerMap[id]

    return (
      <Container>
        <Title type={realLang}>{id}</Title>
        <SubTitle>{'Leaderboard'}</SubTitle>

        <div>
          <Leaders>
            {leaders.map((leader, i) => (
              <LeaderCard key={leader.user.name} leader={leader} rank={i} />
            ))}
          </Leaders>
        </div>

        <SubTitle>{'Races'}</SubTitle>
        <div>{texts.map(text => <TextCard text={text} hideLang key={text.get('id')} />)}</div>
      </Container>
    )
  }
}

export default Language
