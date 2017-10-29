import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { openModal, closeModal } from 'reducers/modals'

import Button from 'components/Button'
import Link from 'components/Link'
import Modal from 'components/Modal'

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

@connect(null, {
  openModal,
  closeModal,
})
class Header extends PureComponent {
  render() {
    const { openModal, closeModal } = this.props
    return (
      <Container>
        <Link to="/">
          <Bold>{'KeyCode'}</Bold>
        </Link>
        <HeaderRight>
          <Link to="/pricing">{'Pricing'}</Link>
          <Button onClick={() => openModal('github')}>{'Login with GitHub'}</Button>
        </HeaderRight>
        <Modal name="github" title="Wanna log with github?">
          {'Blabl balblablb lab lablalaua bal'}
          <br />
          <Button grey style={{ marginTop: 40 }} onClick={() => closeModal('github')}>
            {'Got it!'}
          </Button>
        </Modal>
      </Container>
    )
  }
}

export default Header
