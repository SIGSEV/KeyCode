import React, { PureComponent } from 'react'
import styled from 'styled-components'
import IconCheck from 'react-icons/lib/md/check'

import Button from 'components/Button'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Choices = styled.div`
  display: flex;
  align-items: flex-start;
  > * + * {
    margin-left: 10px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    > * + * {
      margin-left: 0;
      margin-top: 40px;
    }
  }
`

const Choice = styled.div`
  height: 22rem;
  width: ${p => (p.isBig ? 300 : 250)}px;
  border-radius: 8px;
  border: 3px solid ${p => p.theme.darkGrey02};
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    width: 300px;
  }
`

const ChoiceTitle = styled.h2`
  display: flex;
  align-items: center;
  font-weight: bolder;
  background: ${p => p.theme.darkGrey02};
  color: ${p => p.theme.lightgrey02};
  padding: 20px;
`

const Price = styled.div`
  margin-left: auto;
  font-weight: normal;
`

const ChoiceContent = styled.div`
  padding: 20px;
  > * + * {
    margin-top: 20px;
  }
`

const Feature = styled.div`
  display: flex;
  align-items: center;
  svg {
    flex-shrink: 0;
  }
  > * + * {
    margin-left: 10px;
  }
`

const ChoiceFooter = styled.div`
  background: ${p => p.theme.lightgrey02};
  margin-top: auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`

class Pricing extends PureComponent {
  render() {
    return (
      <Container>
        <Choices>
          <Choice>
            <ChoiceTitle>
              {'Basic'}
              <Price>{'Free'}</Price>
            </ChoiceTitle>
            <ChoiceContent>
              <Feature>
                <IconCheck />
                <span>{'5 tests a day'}</span>
              </Feature>
              <Feature>
                <IconCheck />
                <span>{'Statistics'}</span>
              </Feature>
              <Feature>
                <IconCheck />
                <span>{'GitHub badge'}</span>
              </Feature>
            </ChoiceContent>
          </Choice>
          <Choice isBig>
            <ChoiceTitle>
              {'Standard'}
              <Price>{'1 $/mo'}</Price>
            </ChoiceTitle>
            <ChoiceContent>
              <Feature>
                <IconCheck />
                <span>{'Everything from basic'}</span>
              </Feature>
              <Feature>
                <IconCheck />
                <span>{'Unlimited tests'}</span>
              </Feature>
              <Feature>
                <IconCheck />
                <span>
                  <b>{'+5 WPM'}</b>
                  {' by test'}
                </span>
              </Feature>
              <Feature>
                <IconCheck />
                <span>{'Ability to remove results'}</span>
              </Feature>
            </ChoiceContent>
            <ChoiceFooter>
              <Button accent>{'Upgrade'}</Button>
            </ChoiceFooter>
          </Choice>
          <Choice>
            <ChoiceTitle>
              {'Expert'}
              <Price>{'5 $/mo'}</Price>
            </ChoiceTitle>
            <ChoiceContent>
              <Feature>
                <IconCheck />
                <span>{'Everything from standard'}</span>
              </Feature>
              <Feature>
                <IconCheck />
                <span>
                  <b>{'+25 WPM'}</b>
                  {' by test'}
                </span>
              </Feature>
              <Feature>
                <IconCheck />
                <span>{'Gold badges'}</span>
              </Feature>
            </ChoiceContent>
            <ChoiceFooter>
              <Button accent>{'Upgrade'}</Button>
            </ChoiceFooter>
          </Choice>
        </Choices>
      </Container>
    )
  }
}

export default Pricing
