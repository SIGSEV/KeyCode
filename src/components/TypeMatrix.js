import React, { PureComponent } from 'react'
import random from 'lodash/random'
import styled, { keyframes, css } from 'styled-components'
import { scaleLinear } from 'd3-scale'
import isEqual from 'lodash/isEqual'

import * as LAYOUTS from 'assets/layouts'

const keyWidth = 12

const hoverKey = css`
  &:hover {
    .key:not(:hover) {
      opacity: 0.6;
    }
  }
`

const Container = styled.div`
  border-radius: 4px;
  border: 2px solid ${p => p.theme.darkGrey00};
  padding: 2px;

  ${p => (p.hasHover ? hoverKey : null)};

  > * + * {
    margin-top: 2px;
  }
`

const getRowPadding = p => {
  if (p.layout === 'programmerDvorak' && !p.isStaggered && p.index) {
    return keyWidth + 2
  }

  if (p.isStaggered) {
    return keyWidth / 2 * p.index
  }

  return 0
}

const Row = styled.div`
  display: flex;
  padding-left: ${getRowPadding}px;
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
  width: ${keyWidth}px;
  height: 15px;
  background: ${p => (p.keyColor ? p.keyColor : p.theme.darkGrey00)};
  border-radius: 2px;
  animation: ${p => (p.isActive ? `${keyAnim(p)} 250ms linear` : 'none')};
`

const KeyInfo = styled.div`
  height: 2.5rem;
  display: flex;
  justify-content: center;
  margin-top: 0.2rem;
  text-align: center;
`

class Typematrix extends PureComponent {
  static defaultProps = {
    layout: 'programmerDvorak',
    staggered: true,
    wrongKeys: null,
  }

  state = {
    activeKey: null,
    hovered: null,
  }

  componentWillMount() {
    const { wrongKeys, layout } = this.props

    this.initMap(layout)
    if (wrongKeys) {
      this.setKeyCtx(wrongKeys)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeChar !== this.props.activeChar) {
      this.setState({ activeKey: this.getActiveKey(nextProps.activeChar) })
    }

    if (nextProps.wrongKeys && !isEqual(nextProps.wrongKeys, this.props.wrongKeys)) {
      this.setKeyCtx(nextProps.wrongKeys)
    }

    if (nextProps.layout !== this.props.layout) {
      this.initMap(nextProps.layout)
    }
  }

  getActiveKey = activeChar => {
    if (!activeChar) {
      return null
    }

    return this._charMap[activeChar] || null
  }

  initMap = layout => {
    const { activeChar } = this.props

    let id = 0
    this._charMap = LAYOUTS[layout].reduce((map, row) => {
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

  setKeyCtx = wrongKeys => {
    const { layout } = this.props
    const keys = LAYOUTS[layout]

    // Group pair of keys together to get max
    this._maxWrong = keys.reduce((acc, row) => {
      const out = row.reduce((acc, cell) => {
        const total = cell.reduce((total, k) => total + wrongKeys[k.charCodeAt(0)] || 0, 0)
        return total > acc ? total : acc
      }, 0)

      return out > acc ? out : acc
    }, 0)

    this._colorScale = scaleLinear()
      .domain([0, this._maxWrong])
      .range(['#F3E859', '#D88748', '#B56148'])
  }

  getKeyMeta = key => {
    const { wrongKeys } = this.props
    if (!wrongKeys) {
      return { color: null, count: 0 }
    }

    const wrongCount = key.map(k => wrongKeys[k.charCodeAt(0)] || 0).reduce((acc, c) => acc + c, 0)

    const color = wrongCount && this._colorScale(wrongCount)

    return {
      color,
      count: wrongCount,
    }
  }

  render() {
    const { layout, staggered, wrongKeys } = this.props
    const { activeKey, hovered } = this.state

    /* eslint-disable react/no-array-index-key */
    let index = 0
    return (
      <div>
        <Container hasHover={wrongKeys}>
          {LAYOUTS[layout].map((row, i) => (
            <Row isStaggered={staggered} layout={layout} index={i} key={i}>
              {row.map((key, j) => {
                const { color, count } = this.getKeyMeta(key)
                const k = (
                  <Key
                    key={j}
                    className="key"
                    onMouseOver={() => this.setState({ hovered: { key, count } })}
                    onMouseOut={() => this.setState({ hovered: null })}
                    keyColor={color}
                    isActive={activeKey === index}
                  />
                )
                index++
                return k
              })}
            </Row>
          ))}
        </Container>

        {wrongKeys && (
          <KeyInfo>
            {hovered && (
              <div>
                <span>
                  <b>{hovered.key[0]}</b> <b>{hovered.key[1]}</b>
                </span>
                <div>
                  {hovered.count}
                  {' typos'}
                </div>
              </div>
            )}
          </KeyInfo>
        )}
      </div>
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
    clearTimeout(this._timeout)
    this._unmounted = true
  }

  delayType = () => {
    this._timeout = setTimeout(this.type, random(100, 250))
  }

  type = () => {
    const { cursor } = this.state
    const { text } = this.props
    window.requestAnimationFrame(() => {
      if (this._unmounted) {
        return
      }
      this.setState({
        cursor: cursor === text.length - 1 ? 0 : cursor + 1,
      })
      this.delayType()
    })
  }

  render() {
    const { cursor } = this.state
    const { text, staggered } = this.props

    return <Typematrix activeChar={text[cursor]} staggered={staggered} />
  }
}

export default Typematrix
