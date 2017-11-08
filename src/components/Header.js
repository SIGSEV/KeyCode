import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Link as RouterLink, withRouter } from 'react-router-dom'

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

const UserPic = styled(RouterLink)`
  background-image: url(${p => p.pic});
  background-size: cover;
  width: 46px;
  height: 46px;
  border-radius: 5px;
  cursor: pointer;
  color: ${p => p.theme.link};

  &:focus {
    outline: 1px dashed;
  }
`

@withRouter
@connect(({ user }) => ({ user }))
class Header extends PureComponent {
  login = () => {
    const { pathname } = this.props.location
    const redirect = encodeURIComponent(pathname)
    window.location.href = `${__APIURL__}/auth?redirect=${redirect}`
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
          {!user && <Link to="/pricing">{'Pricing'}</Link>}
          {user ? (
            <UserPic to="/u/toto" pic={user.avatar} />
          ) : (
            <Button action={this.login}>{'Login with GitHub'}</Button>
          )}
        </HeaderRight>
      </Container>
    )
  }
}

export default Header
