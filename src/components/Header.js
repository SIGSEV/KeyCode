import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Link from 'components/Link'
import Box from 'components/base/Box'
import UserOrLogin from 'components/UserOrLogin'
import PageLogo from 'components/PageLogo'

const Container = styled.div`
  display: flex;
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

@withRouter
@connect(({ user }) => ({ user }))
class Header extends PureComponent {
  render() {
    const { user } = this.props

    return (
      <Container>
        <Box horizontal flow={40} align="center">
          <PageLogo />
          <Link to="/browse">{'Browse'}</Link>
        </Box>
        <HeaderRight>
          <Link to="/leaderboard">{'LeaderBoard'}</Link>
          {!user && <Link to="/pricing">{'Pricing'}</Link>}
          <UserOrLogin />
        </HeaderRight>
      </Container>
    )
  }
}

export default Header
