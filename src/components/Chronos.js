import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  font-family: monospace;
  display: inline-flex;
  align-items: center;
`

const Seconds = styled.span`
  font-size: 50px;
  line-height: 50px;
`

const Decimal = styled.span`
  font-size: 20px;
  margin-left: 5px;
`

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
      console.log(`stopping timer`)
      clearTimeout(this._timeout)
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout)
    this._unmounted = true
  }

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

    return (
      <Container>
        <Seconds>{Math.floor(timeRemaining)}</Seconds>
        <Decimal>{dec}</Decimal>
      </Container>
    )
  }
}

export default Chronos
