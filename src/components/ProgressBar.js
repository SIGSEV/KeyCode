import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 20px 0;
`

const Thumb = styled.div`
  position: absolute;
  top: -1px;
  left: 0;
  bottom: 0;
  right: 0;
  background: ${p => p.theme.darkGrey01};
  transform-origin: left center;
  transition: 100ms ease-in-out transform;
`

class ScrollBar extends PureComponent {
  render() {
    const { progress } = this.props
    return (
      <Container>
        <Thumb
          style={{
            transform: `scaleX(${progress})`,
          }}
        />
      </Container>
    )
  }
}

export default ScrollBar
