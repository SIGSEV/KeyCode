import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  font-family: monospace;
  font-size: 13px;
  line-height: 13px;
  display: flex;
`

const Label = styled.div`
  font-weight: bold;
  margin-right: 5px;
`

const Value = styled.div`
  opacity: 0.8;
`

export default ({ label, value }) => (
  <Container>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </Container>
)
