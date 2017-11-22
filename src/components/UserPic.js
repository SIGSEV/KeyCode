import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

export default styled(RouterLink)`
  background-image: url(${p => p.pic});
  background-size: cover;
  width: 46px;
  height: 46px;
  border-radius: ${p => (p.fuckradius ? 0 : '5px')};
  cursor: pointer;
  color: ${p => p.theme.link};

  &:focus {
    outline: 1px dashed;
  }
`
