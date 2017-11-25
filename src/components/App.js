import React, { Component } from 'react'
import { Switch, Route } from 'react-router'
import { Provider, connect } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import { withRouter } from 'react-router-dom'

import routes from 'routes'
import theme from 'theme'

import Header from 'components/Header'
import Footer from 'components/Footer'
import Toasts from 'components/Toasts'
import PreventRetardedSize from 'components/PreventRetardedSize'
import ScrollTop from 'components/ScrollTop'

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
    const { showFooter, showHeader } = this.props
    return (
      <AppContainer>
        <PreventRetardedSize />
        {showHeader && <Header />}
        <Main>
          <Switch>{routes.map(route => <Route key={route.path} {...route} />)}</Switch>
        </Main>
        {showFooter && <Footer />}
      </AppContainer>
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
