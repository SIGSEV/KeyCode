import React, { PureComponent } from 'react'
import IconGithub from 'react-icons/lib/fa/github'
import styled from 'styled-components'

import Link from 'components/Link'

const Container = styled.div`
  background: ${p => p.theme.lightgrey02};
  color: ${p => p.theme.darkGrey03};
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 3px inset;
  padding: 15px;
  text-align: center;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: pre;
`

class Footer extends PureComponent {
  render() {
    return (
      <Container>
        {'Built with vim by '}
        <Link href="https://sigsev.io">{'SIGSEV'}</Link>
        <IconGithub style={{ marginRight: 5, marginLeft: 20 }} />
        <Link href="https://github.com/SIGSEV/KeyCode">{'Source code'}</Link>
      </Container>
    )
  }
}

export default Footer
