import React, { PureComponent } from 'react'
import IconNext from 'react-icons/lib/md/keyboard-arrow-right'
import ReactRotatingText from 'react-rotating-text'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { languages, promotedLanguages } from 'helpers/text'
import { loadRandom } from 'actions/race'
import { loadTexts } from 'actions/text'
import { getColor, getTextColor } from 'helpers/colors'

import Box from 'components/base/Box'
import TextCard from 'components/TextCard'
import Button from 'components/Button'
import Link from 'components/Link'
import { AutoTypematrix } from 'components/TypeMatrix'

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 100px 0;

  > * + * {
    margin-top: 40px;
  }
`

const Section = styled.div`
  > * + * {
    margin-top: 20px;
  }
`

const SectionTitle = styled.h2`
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
`

const SectionTitleLink = styled.div`
  margin-left: auto;
  color: ${p => p.theme.link};
  cursor: pointer;
`

const ChallengesCollection = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px -10px -10px -10px;
`

const Challenge = styled(Button)`
  cursor: pointer;
  text-align: center;
  width: 200px;
  height: 200px;
  background-color: ${p => getColor(p.lang)};
  color: ${p => getTextColor(getColor(p.lang))};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 10px;
  text-transform: none;
`

const Title = styled.h1`
  text-align: center;
  font-weight: bolder;
  font-size: 36px;
`

@connect(({ texts }) => ({ texts }), {
  push,
  loadRandom,
  loadTexts,
})
class Home extends PureComponent {
  state = {
    openLangs: false,
  }

  componentDidMount() {
    const { loadTexts } = this.props
    loadTexts()
  }

  renderLanguage = l => (
    <Challenge action={() => this.props.loadTexts(l)} to={`/l/${l.toLowerCase()}`} lang={l} key={l}>
      {l}
    </Challenge>
  )

  render() {
    const { openLangs } = this.state
    const { texts, loadRandom } = this.props

    return (
      <Box>
        <Hero>
          <Title>
            <ReactRotatingText
              emptyPause={500}
              items={[
                'Challenge',
                'Perfect',
                'Enhance',
                'Advance',
                'Sublimate',
                'Upgrade',
                'Develop',
              ]}
            />
            {' your coding speed.'}
          </Title>
          <AutoTypematrix text="Welcome to KeyCode!" staggered={false} />
          <Button accent action={() => loadRandom()}>
            {'Random race'}
            <IconNext style={{ marginLeft: 10 }} />
          </Button>
          <div>
            {'or '}
            <Link to="/new">{'Create race'}</Link>
          </div>
        </Hero>

        <Box narrow flow={50}>
          <Section>
            <SectionTitle>
              {'Challenges by language'}
              <SectionTitleLink onClick={() => this.setState({ openLangs: !openLangs })}>
                <div>{openLangs ? 'Unsee' : `See all (${languages.length})`}</div>
              </SectionTitleLink>
            </SectionTitle>

            <ChallengesCollection>
              {promotedLanguages.map(this.renderLanguage)}

              {openLangs &&
                languages.filter(l => !promotedLanguages.includes(l)).map(this.renderLanguage)}
            </ChallengesCollection>
          </Section>

          <SectionTitle>{'Top rated'}</SectionTitle>
          <div>
            {texts.get('global').map(text => <TextCard text={text} key={text.get('id')} />)}
          </div>
        </Box>
      </Box>
    )
  }
}

export default Home
