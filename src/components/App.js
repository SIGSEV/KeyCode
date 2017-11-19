import React, { Component } from 'react'
import { Switch, Route } from 'react-router'
import { Provider, connect } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { Motion, spring } from 'react-motion'
import { withRouter } from 'react-router-dom'

import routes from 'routes'
import theme from 'theme'

import Header from 'components/Header'
import Footer from 'components/Footer'
import Toasts from 'components/Toasts'
import PreventRetardedSize from 'components/PreventRetardedSize'
import ScrollTop from 'components/ScrollTop'

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
  display: flex;
  flex-direction: column;
  position: relative;
`

@withRouter
@connect(
  (state, props) => ({
    hasModal: hasModal(state),
    showHeader: !props.location.pathname.startsWith('/r/'),
    showFooter: !props.location.pathname.startsWith('/r/'),
  }),
  null,
  null,
  {
    pure: false,
  },
)
class App extends Component {
  render() {
    const { hasModal, showFooter, showHeader } = this.props
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
            {showHeader && <Header />}
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
        <ScrollTop>
          <App />
          <Toasts />
        </ScrollTop>
      </Router>
    </ThemeProvider>
  </Provider>
)
