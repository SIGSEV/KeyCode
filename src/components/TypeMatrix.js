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

const PerBadge = styled.span`
  background-color: ${p => p.theme.darkGrey00};
  color: white;
  border-radius: 2px;
  padding: 0.1rem 0.4rem;
  margin-left: 0.5rem;
`

const TypoStats = styled.div`
  margin-top: 0.5rem;
  font-size: 11px;
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
    const { wrongKeys, validKeys, layout } = this.props

    this.initMap(layout)
    if (wrongKeys && validKeys) {
      this.setKeyCtx(wrongKeys, validKeys)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeChar !== this.props.activeChar) {
      this.setState({ activeKey: this.getActiveKey(nextProps.activeChar) })
    }

    if (nextProps.wrongKeys && !isEqual(nextProps.wrongKeys, this.props.wrongKeys)) {
      this.setKeyCtx(nextProps.wrongKeys, nextProps.validKeys)
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

  setKeyCtx = (wrongKeys, validKeys) => {
    const { layout } = this.props
    const keys = LAYOUTS[layout]

    this._wrongMap = {}

    keys.forEach(row => {
      row.forEach(cell => {
        const wrongs = wrongKeys[cell[0].charCodeAt(0)] + wrongKeys[cell[1].charCodeAt(0)]
        const rights = validKeys[cell[0].charCodeAt(0)] + validKeys[cell[1].charCodeAt(0)]
        const per = Math.round(wrongs / rights * 100)
        if (!this._maxWrong || per > this._maxWrong) {
          this._maxWrong = per
        }

        this._wrongMap[cell[0]] = {
          wrongs,
          rights,
          per,
        }
      })
    })

    this._colorScale = scaleLinear()
      .domain([0, this._maxWrong])
      .range(['#F3E859', '#D88748', '#B56148'])
  }

  getKeyMeta = key => {
    const { wrongKeys } = this.props
    if (!wrongKeys) {
      return { color: null, meta: [] }
    }

    const meta = this._wrongMap[key[0]] || {}
    const color = meta.per ? this._colorScale(meta.per) : '#a3e26e'

    return { color, meta }
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
                const { color, meta } = this.getKeyMeta(key)
                const k = (
                  <Key
                    key={j}
                    className="key"
                    onMouseOver={() => this.setState({ hovered: { key, meta } })}
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
                  {hovered.meta && (
                    <PerBadge>
                      {hovered.meta.per || 0}
                      {'%'}
                    </PerBadge>
                  )}
                </span>
                {hovered.meta && (
                  <TypoStats>
                    {`${hovered.meta.wrongs || 0} typos / ${hovered.meta.rights || 0}`}
                  </TypoStats>
                )}
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
