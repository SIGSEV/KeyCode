import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

import Link from 'components/Link'
import UserOrLogin from 'components/UserOrLogin'

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

@withRouter
class Header extends PureComponent {
  render() {
    return (
      <Container>
        <Link to="/">
          <Bold>{'KeyCode'}</Bold>
        </Link>
        <HeaderRight>
          <Link to="/leaderboard">{'LeaderBoard'}</Link>
          <Link to="/pricing">{'Pricing'}</Link>
          <UserOrLogin />
        </HeaderRight>
      </Container>
    )
  }
}

export default Header
