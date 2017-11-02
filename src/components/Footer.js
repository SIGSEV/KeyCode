import React, { PureComponent } from 'react'
import IconGithub from 'react-icons/lib/fa/github'
import styled from 'styled-components'

import Link from 'components/Link'

const Container = styled.div`
  background: ${p => p.theme.lightgrey02};
  color: ${p => p.theme.darkGrey03};
  margin-top: 100px;
  padding: 100px;
  text-align: center;
  font-size: 12px;
`

class Footer extends PureComponent {
  render() {
    return (
      <Container>
        {'Built with vim by SIGSEV. - '}
        <IconGithub style={{ marginRight: 5 }} />
        <Link href="https://github.com/SIGSEV/KeyCode" target="_blank" rel="noreferrer noopener">
          {'Source code'}
        </Link>
      </Container>
    )
  }
}

export default Footer
