import React, { Component } from 'react'
import { Switch, Route } from 'react-router'
import { Provider, connect } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { Motion, spring } from 'react-motion'

import routes from 'routes'
import theme from 'theme'

import Header from 'components/Header'
import Footer from 'components/Footer'
import PreventRetardedSize from 'components/PreventRetardedSize'

import { hasModal } from 'reducers/modals'

const AppContainer = styled.div`
  font-family: Inter, sans-serif;
  min-height: 100vh;
  will-change: transform;
  background: ${p => p.theme.bg};
  color: ${p => p.theme.darkGrey00};
  display: flex;
  flex-direction: column;

  b {
    font-weight: bolder;
  }
`

const Main = styled.div`
  padding: 40px;
  flex-grow: 1;
`

@connect(
  state => ({
    hasModal: hasModal(state),
    showFooter: !state.router.location.pathname.startsWith('/race/'),
  }),
  null,
  null,
  {
    pure: false,
  },
)
class App extends Component {
  render() {
    const { hasModal, showFooter } = this.props
    return (
      <Motion
        style={{
          opacity: spring(hasModal ? 0.4 : 1, { stiffness: 300 }),
          offset: spring(hasModal ? -20 : 0, { stiffness: 300 }),
          scale: spring(hasModal ? 0.9 : 1, { stiffness: 300 }),
        }}
      >
        {m => (
          <AppContainer
            style={{
              transform: `scale(${m.scale}) translate3d(0, ${m.offset}px, 0)`,
              opacity: m.opacity,
            }}
          >
            <PreventRetardedSize />
            <Header />
            <Main>
              <Switch>{routes.map(route => <Route key={route.path} {...route} />)}</Switch>
            </Main>
            {showFooter && <Footer />}
          </AppContainer>
        )}
      </Motion>
    )
  }
}

export default (store, Router, routerProps) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router {...routerProps}>
        <App />
      </Router>
    </ThemeProvider>
  </Provider>
)
