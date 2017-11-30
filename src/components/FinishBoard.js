import React, { PureComponent } from 'react'
import reduce from 'lodash/reduce'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { openModal, closeModal } from 'reducers/modals'

import Link from 'components/Link'
import Box from 'components/base/Box'
import Modal from 'components/Modal'
import Button from 'components/Button'
import Score from 'components/Score'

import { getPlayer } from 'reducers/race'
import getScore from 'helpers/getScore'

const Detail = styled.table`
  text-align: left;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-collapse: collapse;
  box-shadow: rgba(0, 0, 0, 0.1) 0 2px 10px;

  td {
    padding: 10px;
    border: 1px solid ${p => p.theme.darkGrey03};
  }

  td + td {
    width: 100px;
    text-align: center;
  }

  tr:last-child {
    background-color: rgba(0, 0, 0, 0.1);

    td:last-child {
      background-color: ${p => p.theme.darkerGrey03};
      font-weight: bold;
    }
  }
`

const Small = styled.div`
  font-size: 12px;
  opacity: ${p => (p.noOp ? 1 : 0.6)};
`

const ModuloContainer = styled.td`
  color: ${p => (p.isPositive ? p.theme.green : p.isNegative ? p.theme.red : null)};
`

function getCharSpan(stats) {
  return reduce(
    stats,
    (acc, val, key) => [
      ...acc,
      ...(acc.length > 0 ? [', '] : []),
      <span key={key}>
        <b>{val}</b>
        &nbsp;
        {key}
      </span>,
    ],
    [],
  )
}

function Modulo({ value }) {
  return (
    <ModuloContainer isPositive={value > 0} isNegative={value < 0}>
      {value === 0 ? '-' : value > 0 ? `+${value}` : value}
    </ModuloContainer>
  )
}

@connect(
  state => ({
    player: getPlayer(state),
    isFinished: !state.race.get('isGhosting') && state.race.get('isFinished'),
  }),
  {
    openModal,
    closeModal,
  },
)
class FinishBoard extends PureComponent {
  componentDidUpdate(prevProps) {
    const { isFinished, openModal, closeModal } = this.props
    if (isFinished && !prevProps.isFinished) {
      window.requestAnimationFrame(() => {
        openModal('finishBoard')
      })
    }

    if (!isFinished && prevProps.isFinished) {
      closeModal('finishBoard')
    }
  }

  render() {
    const { onRestart, player, isFinished } = this.props

    // prevent unnecessary render
    if (!isFinished) {
      return null
    }

    const score = getScore(player.toJS())

    return (
      <Modal name="finishBoard" onClose={onRestart}>
        <Box flow={20}>
          <Box horizontal justify="space-between" align="center">
            <Score score={score.score} />
            <Button accent onClick={onRestart}>
              {'Restart'}
            </Button>
          </Box>
          <Detail>
            <tbody>
              {score.correctCharsScore !== 0 && (
                <tr>
                  <td>
                    {'Correct chars'}
                    <Small>{getCharSpan(score.correctCharsStats)}</Small>
                  </td>
                  <Modulo value={score.correctCharsScore} />
                </tr>
              )}
              {score.wrongCharsScore !== 0 && (
                <tr>
                  <td>
                    {'Wrong chars'}
                    <Small>{getCharSpan(score.wrongCharsStats)}</Small>
                  </td>
                  <Modulo value={-score.wrongCharsScore} />
                </tr>
              )}
              <tr>
                <td>
                  {'Time'}
                  <Small>{'seconds'}</Small>
                </td>
                <td>{score.time}</td>
              </tr>
              <tr>
                <td>
                  <b>{'CPM'}</b>
                </td>
                <td>{score.cpm}</td>
              </tr>
            </tbody>
          </Detail>
          <Detail>
            <tbody>
              <tr>
                <td>
                  {'WPM'}
                  <Small>{'CPM / 5'}</Small>
                </td>
                <td>{score.wpm}</td>
              </tr>
              <tr>
                <td>{'Wrong words'}</td>
                <Modulo value={-score.wrongWordsCount} />
              </tr>
              <tr>
                <td>
                  {'Premium bonus'}
                  <Small noOp>
                    <Link to="/pricing">{"What's this?"}</Link>
                  </Small>
                </td>
                <Modulo value={score.premiumBonus} />
              </tr>
              <tr>
                <td>
                  <b>{'Total'}</b>
                </td>
                <td>{score.score}</td>
              </tr>
            </tbody>
          </Detail>
        </Box>
      </Modal>
    )
  }
}

export default FinishBoard
