import React, { PureComponent } from 'react'
import Mortal from 'react-mortal'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { isModalOpened, closeModal } from 'reducers/modals'

const Container = styled.div`
  font-family: Inter, sans-serif;
  pointer-events: ${p => (p.noEvents ? 'none' : 'auto')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
  padding-bottom: 20px;
  overflow-y: auto;
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const ModalBox = styled.div`
  outline: none;
  background: ${p => p.theme.darkGrey00};
  box-shadow: rgba(0, 0, 0, 0.7) 0 8px 25px, rgba(0, 0, 0, 0.3) 0 0 50px inset;
  padding: 40px;
  width: 600px;
  will-change: transform;
  color: white;
  text-shadow: rgba(0, 0, 0, 0.2) 0 1px 0;
`

const Title = styled.h2`
  font-size: 40px;
  font-family: 'InterBolder';
  font-weight: bolder;
  text-shadow: rgba(0, 0, 0, 0.2) 0 2px 0;
`

@connect(
  (state, props) => ({
    isOpened: props.name ? isModalOpened(state, props.name) : props.isOpened,
  }),
  {
    closeModal,
  },
)
class Modal extends PureComponent {
  componentDidUpdate(prevProps) {
    if (!prevProps.isOpened && this.props.isOpened) {
      this._backupElement = document.activeElement
      this._modal.focus()
    }
    if (prevProps.isOpened && !this.props.isOpened) {
      if (this._backupElement) {
        this._backupElement.focus()
      }
    }
  }

  handleClose = () => {
    const { name, closeModal, onClose } = this.props
    if (name) {
      closeModal(name)
    }

    if (onClose) {
      onClose()
    }
  }

  preventDefault = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    const { isOpened, title, children } = this.props

    return (
      <Mortal
        isOpened={isOpened}
        onClose={this.handleClose}
        motionStyle={(spring, isVisible) => ({
          opacity: spring(isVisible ? 1 : 0, { stiffness: 300 }),
          offset: spring(isVisible ? 0 : 20, { stiffness: 300 }),
          scale: spring(isVisible ? 1 : 1.2, { stiffness: 300 }),
        })}
      >
        {(m, isVisible) => (
          <Container noEvents={!isVisible}>
            <Overlay onClick={this.handleClose} />
            <div
              style={{
                opacity: m.opacity,
                transform: `scale(${m.scale}) translate3d(0, ${m.offset}px, 0)`,
              }}
            >
              <ModalBox
                tabIndex={0}
                innerRef={n => (this._modal = n)}
                onClick={this.preventDefault}
              >
                {title && <Title>{title}</Title>}
                {children}
              </ModalBox>
            </div>
          </Container>
        )}
      </Mortal>
    )
  }
}

export default Modal
