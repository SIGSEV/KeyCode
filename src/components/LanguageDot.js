import styled from 'styled-components'

import { getColor } from 'helpers/colors'

export default styled.div`
  width: ${p => p.size || '0.5rem'};
  height: ${p => p.size || '0.5rem'};
  background-color: ${p => getColor(p.type)};
  border-radius: 50%;
`
