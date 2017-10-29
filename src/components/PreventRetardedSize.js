import React from 'react'
import styled from 'styled-components'
import IconPhone from 'react-icons/lib/md/phone-android'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${p => p.theme.darkGrey00};
  color: ${p => p.theme.lightgrey01};
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  font-weight: bolder;
  font-size: 24px;
  padding: 20px;
  text-align: center;
  align-items: center;
  padding-top: 100px;
  pointer-events: none;
  opacity: 0;

  svg {
    margin-bottom: 40px;
  }

  @media (max-width: 360px) {
    opacity: 1;
    pointer-events: auto;
  }
`

export default () => (
  <Container>
    <IconPhone size={50} />
    {'You have nothing to do here.'}
  </Container>
)
