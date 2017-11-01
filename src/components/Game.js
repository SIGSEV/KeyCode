import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Map } from 'immutable'

import TypeWriter from 'components/TypeWriter'
import Typematrix from 'components/Typematrix'
import Stat from 'components/Stat'
import ProgressBar from 'components/ProgressBar'

const Container = styled.div`
  color: ${p => p.theme.darkGrey00};
  font-size: 18px;
  line-height: 24px;
`

const StatsContainer = styled.div`
  display: flex;

  > * + * {
    margin-left: 20px;
  }
`

const KeyboardContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
`

class Game extends PureComponent {
  state = {
    activeChar: null,
    stats: Map({
      words: 0,
      wrongWords: 0,
      corrections: 0,
      typedWords: 0,
    }),
  }

  handleCountNonBlankWords = count => {
    this.setState({ stats: this.state.stats.set('nonBlankWords', count) })
  }

  handleCorrection = () => {
    const { stats } = this.state
    const corrections = stats.get('corrections')
    this.setState({ stats: stats.set('corrections', corrections + 1) })
  }

  handleValidateWord = () => {
    const { stats } = this.state
    const typedWords = stats.get('typedWords')
    this.setState({ stats: stats.set('typedWords', typedWords + 1) })
  }

  handleValidateWrongWord = () => {
    const { stats } = this.state
    const wrongWords = stats.get('wrongWords')
    const typedWords = stats.get('typedWords')
    this.setState({
      stats: stats.set('wrongWords', wrongWords + 1).set('typedWords', typedWords + 1),
    })
  }

  handleCountWords = words => {
    this.setState({
      stats: this.state.stats.set('words', words),
    })
  }

  handleSetActiveChar = char => {
    this.setState({
      activeChar: char,
    })
  }

  render() {
    const { text } = this.props
    const { stats, activeChar } = this.state
    const typedWords = stats.get('typedWords')
    const totalWords = stats.get('words')
    const accuracy = typedWords
      ? ((1 - stats.get('wrongWords') / typedWords) * 100).toFixed(2)
      : '100.00'
    const progress = totalWords ? typedWords / totalWords : 0

    return (
      <Container>
        <KeyboardContainer>
          <Typematrix activeChar={activeChar} />
        </KeyboardContainer>

        <StatsContainer>
          <Stat label="Accuracy" value={accuracy} />
          <Stat label="Corrections" value={stats.get('corrections')} />
          <Stat label="Wrong" value={stats.get('wrongWords')} />
        </StatsContainer>

        <ProgressBar progress={progress} />

        <TypeWriter
          text={text}
          onChar={this.handleSetActiveChar}
          onCorrection={this.handleCorrection}
          onValidateWord={this.handleValidateWord}
          onValidateWrongWord={this.handleValidateWrongWord}
          onCountWords={this.handleCountWords}
        />
      </Container>
    )
  }
}

export default Game
