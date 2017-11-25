import React from 'react'
import styled from 'styled-components'

const LEVEL_MAP = {
  '0': { color: 'lightgrey01', text: 'Draft' },
  '1': { color: 'lightgrey01', text: 'Baby text' },
  '2': { color: 'green', text: 'Easy' },
  '3': { color: 'yellow', text: 'Medium' },
  '4': { dark: true, color: 'orange', text: 'Difficult' },
  '5': { dark: true, color: 'red', text: 'Hardcore' },
}

const Badge = styled.div`
  font-size: 11px;
  white-space: nowrap;
  border-radius: 2px;

  color: ${p => (p.dark ? 'white' : null)};
  background: ${p => p.theme[p.color]};
  padding: 1px 3px;
`

export default ({ level }) => (
  <Badge dark={LEVEL_MAP[level].dark} color={LEVEL_MAP[level].color}>
    {LEVEL_MAP[level].text}
  </Badge>
)
