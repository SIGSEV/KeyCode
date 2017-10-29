import React, { PureComponent } from 'react'
import random from 'lodash/random'
import styled, { keyframes } from 'styled-components'

import DVORAK from 'assets/layouts/dvorak'

const Container = styled.div`
  border-radius: 4px;
  border: 2px solid ${p => p.theme.darkGrey00};
  padding: 2px;
  > * + * {
    margin-top: 2px;
  }
`

const Row = styled.div`
  display: flex;
  > * + * {
    margin-left: 2px;
  }
`

const keyAnim = p => keyframes`
  0% {
    background: ${p.theme.red};
  }
  100% {
    background: ${p.theme.darkGrey00};
  }
`

const Key = styled.div`
  width: 12px;
  height: 15px;
  background: ${p => p.theme.darkGrey00};
  border-radius: 2px;
  animation: ${p => (p.isActive ? `${keyAnim(p)} 250ms linear` : 'none')};
`

class Typematrix extends PureComponent {
  state = {
    activeKey: null,
  }

  componentWillMount() {
    const { activeChar } = this.props

    let id = 0
    this._charMap = DVORAK.reduce((map, row) => {
      row.forEach(pair => {
        map[pair[0]] = id
        map[pair[1]] = id
        id++
      })
      return map
    }, {})

    this.setState({
      activeKey: this.getActiveKey(activeChar),
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeChar !== this.props.activeChar) {
      this.setState({ activeKey: this.getActiveKey(nextProps.activeChar) })
    }
  }

  getActiveKey(activeChar) {
    if (!activeChar) {
      return null
    }
    return this._charMap[activeChar] || null
  }

  render() {
    const { activeKey } = this.state
    /* eslint-disable react/no-array-index-key */
    let index = 0
    return (
      <Container>
        {DVORAK.map((row, i) => (
          <Row key={i}>
            {row.map((key, j) => {
              const k = <Key key={j} isActive={activeKey === index} />
              index++
              return k
            })}
          </Row>
        ))}
      </Container>
    )
    /* eslint-enable react/no-array-index-key */
  }
}

export class AutoTypematrix extends PureComponent {
  state = {
    cursor: 0,
  }

  componentDidMount() {
    this.delayType()
  }

  componentWillUnmount() {
    this._unmounted = true
  }

  delayType = () => {
    setTimeout(this.type, random(100, 250))
  }

  type = () => {
    if (this._unmounted) {
      return
    }
    const { cursor } = this.state
    const { text } = this.props
    window.requestAnimationFrame(() => {
      this.setState({
        cursor: cursor === text.length - 1 ? 0 : cursor + 1,
      })
      this.delayType()
    })
  }

  render() {
    const { cursor } = this.state
    const { text } = this.props
    return <Typematrix activeChar={text[cursor]} />
  }
}

export default Typematrix
