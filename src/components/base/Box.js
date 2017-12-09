import styled from 'styled-components'

export default styled.div`
  flex-grow: ${p => (p.grow ? 1 : 0)};
  display: flex;
  flex-direction: ${p => (p.horizontal ? 'row' : 'column')};
  align-items: ${p => p.align};
  justify-content: ${p => p.justify};
  overflow: ${p => (p.scrollable ? 'auto' : 'unset')};
  position: ${p => (p.relative ? 'relative' : p.sticky ? 'absolute' : 'static')};
  padding: ${p => `${p.padding}px`};
  margin-left: ${p => (p.mla ? 'auto' : '')};
  ${p =>
    p.sticky &&
    `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `} > * + * {
    margin-top: ${p => (!p.horizontal && p.flow ? `${p.flow}px` : null)};
    margin-left: ${p => (p.horizontal && p.flow ? `${p.flow}px` : null)};
  }
`
