import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  font-family: monospace;
  display: inline-flex;
  align-items: center;
  color: ${p => p.theme.yellow};
`

const Seconds = styled.span``

class Chronos extends PureComponent {
  state = {
    timeStart: 0,
    timeRemaining: 0,
  }

  componentWillMount() {
    const { seconds } = this.props
    this.setState({ timeRemaining: seconds })
  }

  componentWillReceiveProps(nextProps) {
    const { isRunning: wasRunning } = this.props
    const { seconds, isRunning } = nextProps
    if (isRunning && !wasRunning) {
      this.setState({ timeStart: Date.now(), timeRemaining: seconds })
      this.tick()
    }
    if (!isRunning && wasRunning) {
      clearTimeout(this._timeout)
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
    this._unmounted = true
  }

  get = () => this.props.seconds - this.state.timeRemaining;

  reset = () => {
    clearTimeout(this._timeout)
    const { seconds } = this.props
    this.setState({ timeRemaining: seconds })
  }

  tick = () => {
    this._timeout = setTimeout(() => {
      window.requestAnimationFrame(() => {
        if (this._unmounted) {
          return
        }
        const { isRunning, seconds, onFinish } = this.props
        if (!isRunning) {
          return
        }
        const { timeStart } = this.state
        const now = Date.now()
        // leap second may fuck this up, but should we care?
        const delta = now - timeStart
        const timeRemaining = Number((seconds - delta / 1000).toFixed(1))
        if (timeRemaining <= 0) {
          this.setState({ timeRemaining: 0 })
          onFinish()
        } else {
          this.setState({ timeRemaining })
          this.tick()
        }
      })
    }, 16)
  }

  render() {
    const { timeRemaining } = this.state

    const dec = ((timeRemaining - Math.floor(timeRemaining)) * 10).toFixed(0)

    return <Container>{`${Math.floor(timeRemaining)}.${dec}s`}</Container>
  }
}

export default Chronos
