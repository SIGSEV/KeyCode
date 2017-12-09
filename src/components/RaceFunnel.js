import React, { PureComponent } from 'react'
import IconCaret from 'react-icons/lib/md/keyboard-arrow-right'
import { connect } from 'react-redux'

import Box from 'components/base/Box'
import Link from 'components/Link'

@connect(state => ({
  race: state.race,
}))
class RaceFunnel extends PureComponent {
  render() {
    const { race } = this.props
    const language = race.get('language')
    return (
      <Box horizontal align="center" flow={5}>
        <Link to="/browse">{'Browse'}</Link>
        <IconCaret />
        <Link to={`/browse?language=${language.toLowerCase()}`}>{language}</Link>
        <IconCaret />
        <span>{race.get('title')}</span>
      </Box>
    )
  }
}

export default RaceFunnel
