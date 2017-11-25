import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Steack from 'react-steack'

import { removeToast } from 'reducers/toasts'

const Container = styled.div`
  position: fixed;
  top: auto;
  left: auto;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
`

const Toast = styled.div`
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
  font-family: monospace;
  min-width: 15rem;
  background-color: ${p => p.theme.toasts[p.type]};
  color: white;
`

@connect(({ toasts }) => ({ toasts }), { removeToast })
class Toasts extends Component {
  render() {
    const { toasts, removeToast } = this.props

    return (
      <Container>
        <Steack reverse align={'right'} springConfig={{ stiffness: 250 }}>
          {Object.keys(toasts).map(id => (
            <Toast key={id} type={toasts[id].type} onClick={() => removeToast(id)}>
              {toasts[id].msg}
            </Toast>
          ))}
        </Steack>
      </Container>
    )
  }
}

export default Toasts
