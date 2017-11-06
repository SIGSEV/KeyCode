import React, { PureComponent } from 'react'
import IconNext from 'react-icons/lib/md/keyboard-arrow-right'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Star from 'react-icons/lib/go/star'

import { loadRace, loadRandom } from 'actions/race'
import { loadTexts } from 'actions/text'

import Button from 'components/Button'
import Link from 'components/Link'
import { AutoTypematrix } from 'components/Typematrix'

const Container = styled.div`
  > * + * {
    margin-top: 70px;
  }
`

const Narrow = styled.div`
  max-width: 860px;
  margin: 0 auto;
  > * + * {
    margin-top: 70px;
  }
`

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
`

const ChallengesCollection = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 10px -10px -10px -10px;
`

const Challenge = styled.div`
  text-align: center;
  width: 200px;
  height: 200px;
  background: ${p => p.theme.lightgrey01};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 10px;
`

const Title = styled.h1`
  text-align: center;
  font-weight: bolder;
  font-size: 36px;
`

@connect(({ texts }) => ({ texts }), {
  push,
  loadRace,
  loadRandom,
  loadTexts,
})
class Home extends PureComponent {
  componentDidMount() {
    const { texts, loadTexts } = this.props
    if (!texts.get('global').size) {
      loadTexts()
    }
  }

  render() {
    const { texts, loadRace, loadRandom } = this.props

    return (
      <Container>
        <Hero>
          <Title>{'Improve your coding speed.'}</Title>
          <AutoTypematrix text="Welcome to KeyCode!" />
          <Button accent action={() => loadRandom()}>
            {'Random race'}
            <IconNext style={{ marginLeft: 10 }} />
          </Button>
          <div>
            {'or '}
            <Link to="/new">{'Create race'}</Link>
          </div>
        </Hero>

        <Narrow>
          <Section>
            <SectionTitle>
              {'Challenges by language'}
              <SectionTitleLink>
                <Link to="/challenges">{'See all (42)'}</Link>
              </SectionTitleLink>
            </SectionTitle>

            <ChallengesCollection>
              <Challenge>{'JS'}</Challenge>
              <Challenge>{'C'}</Challenge>
              <Challenge>{'Ruby (stanford)'}</Challenge>
              <Challenge>{'Python'}</Challenge>
            </ChallengesCollection>
          </Section>

          <SectionTitle>{'Top rated'}</SectionTitle>
          {texts.get('global').map(text => (
            <div key={text.get('id')}>
              {text.get('title')}
              <Button action={() => loadRace(text.get('id'))} to={`/r/${text.get('id')}`} accent>
                load
              </Button>
              <marquee>
                {text.get('language')} <Star />
                {text.get('stars')}
              </marquee>
              <hr />
            </div>
          ))}
        </Narrow>
      </Container>
    )
  }
}

export default Home
