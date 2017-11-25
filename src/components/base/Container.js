import styled from 'styled-components'

export default styled.div`
  max-width: ${p => (p.narrow ? '860px' : 'unset')};
  margin: ${p => (p.narrow ? '0 auto' : 'unset')};
  > * + * {
    margin-top: ${p => (p.flow ? `${p.flow}px` : 'unset')};
  }
`
