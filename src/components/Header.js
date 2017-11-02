import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Button from 'components/Button'
import Link from 'components/Link'

const Container = styled.div`
  display: flex;
  padding: 40px;
  align-items: center;
  > * + * {
    margin-left: 40px;
  }

  @media (max-width: 500px) {
    flex-direction: column;
    > * + * {
      margin-left: 0;
      margin-top: 40px;
    }
  }
`

const HeaderRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 40px;
  }
  @media (max-width: 500px) {
    margin-left: initial;
  }
`

const Bold = styled.div`
  font-family: InterBolder;
  font-size: 20px;
  color: ${p => p.theme.darkGrey00};
  user-select: none;
`

const Pic = styled.img`
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 150ms ease-in;
  &:hover {
    opacity: 1;
  }
`

@connect(({ user }) => ({ user }))
class Header extends PureComponent {
  login = () => {
    window.location.href = `${__APIURL__}/auth`
    return new Promise(resolve => setTimeout(resolve, 10e3))
  }

  render() {
    const { user } = this.props

    return (
      <Container>
        <Link to="/">
          <Bold>{'KeyCode'}</Bold>
        </Link>
        <HeaderRight>
          <Link to="/pricing">{'Pricing'}</Link>
          {user ? (
            <Pic src={user.avatar} width={50} />
          ) : (
            <Button action={this.login}>{'Login with GitHub'}</Button>
          )}
        </HeaderRight>
      </Container>
    )
  }
}

export default Header
