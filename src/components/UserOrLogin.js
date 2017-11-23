import React, { Component } from 'react'
import { connect } from 'react-redux'
import GithubIcon from 'react-icons/lib/go/mark-github'

import { getPayload } from 'helpers/race'
import Button from 'components/Button'
import UserPic from 'components/UserPic'

@connect(({ user, race, router: { location } }) => ({
  user,
  race: race.get('lastRace'),
  location,
}))
class UserOrLogin extends Component {
  login = () => {
    const { race, location } = this.props
    const pathname = location ? location.pathname : '/'
    const redirect = encodeURIComponent(pathname)
    const save = getPayload(race)
    const savePayload = save.time ? `&save=${JSON.stringify(save)}` : ''

    window.location.href = `${__APIURL__}/auth?redirect=${redirect}${savePayload}`
    return new Promise(resolve => setTimeout(resolve, 10e3))
  }

  render() {
    const { user, fuckradius } = this.props

    return user ? (
      <UserPic to="/u/toto" pic={user.avatar} fuckradius={fuckradius} />
    ) : (
      <Button action={this.login}>
        <GithubIcon style={{ marginRight: '0.5rem' }} />
        {'Login'}
      </Button>
    )
  }
}

export default UserOrLogin
