import styled from 'styled-components'

export default styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  max-width: ${p => (p.narrow ? '860px' : 'unset')};
  margin: ${p => (p.narrow ? '0 auto' : 'unset')};
  overflow: ${p => (p.scrollable ? 'auto' : 'unset')};
  position: ${p => (p.relative ? 'relative' : p.sticky ? 'absolute' : 'static')};
  ${p =>
    p.sticky &&
    `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `} > * + * {
    margin-top: ${p => (p.flow ? `${p.flow}px` : 'unset')};
  }
`
