import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import IconGhost from 'react-icons/lib/md/airplay'
import IconClear from 'react-icons/lib/md/clear'

import Box from 'components/base/Box'
import Button from 'components/Button'

import { removeGhost } from 'reducers/race'

const Container = styled(Box)`
  background: ${p => p.theme.darkGrey00};
  color: ${p => p.theme.lightgrey03};
  border-radius: 3px;
  font-size: 10px;
  line-height: 12px;
`

const Label = styled.span`
  font-size: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
`

@connect(null, {
  removeGhost,
})
class GhostInfos extends PureComponent {
  render() {
    const { ghost, removeGhost } = this.props
    return (
      <Container horizontal padding={10} flow={10} align="center">
        <IconGhost size={20} />
        <Box>
          <Label>{'Ghosting against'}</Label>
          <Box horizontal align="center" flow={5}>
            <span style={{ background: '#1687ee', width: 8, height: 8, borderRadius: 8 }} />
            <span>
              <b>{ghost.getIn(['user', 'name'])}</b>
              <span>{` - ${ghost.get('score')}`}</span>
            </span>
          </Box>
        </Box>
        <Box mla>
          <Button smallPad noHeight onClick={() => removeGhost()}>
            <IconClear style={{ marginRight: 3 }} />
          </Button>
        </Box>
      </Container>
    )
  }
}

export default GhostInfos
