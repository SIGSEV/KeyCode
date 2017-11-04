import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { logout } from 'actions/user'

import Button from 'components/Button'

const Container = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`

@connect(null, { logout })
class User extends PureComponent {
  render() {
    return (
      <Container>
        <Button action={() => this.props.logout()}>{'Logout'}</Button>
      </Container>
    )
  }
}

export default User
