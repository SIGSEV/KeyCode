import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import Box from 'components/base/Box'
import TextList from 'components/TextList'
import Button from 'components/Button'

import { gradeText, loadTexts } from 'actions/text'

const EvalBox = styled.div`
  flex-grow: 1;
  display: flex;
  border: 1px solid ${p => p.theme.lightgrey01};
`

const EvalActions = styled.div`
  min-height: 50px;
  padding: 0 10px;
  display: flex;
  font-size: 13px;
  align-items: center;
  overflow: auto;
  background: ${p => p.theme.lightgrey02};
  border-bottom: 1px solid ${p => p.theme.lightgrey01};

  > * + * {
    margin-left: 10px;
  }
`

const TextContent = styled.div`
  font-family: monospace;
  padding: 10px;
  white-space: pre;
`

const actions = ['0 - Shit', '1 - Baby', '2 - Easy', '3 - Medium', '4 - Hard', '5 - Hardcore']

@connect(({ user, texts }) => ({ user, texts: texts.get('eval') }), {
  loadTexts,
  gradeText,
})
class Eval extends PureComponent {
  state = {
    focusedText: null,
  }

  componentDidMount() {
    const { texts, loadTexts } = this.props

    if (texts.size) {
      return
    }

    loadTexts({ evalMode: true, limit: 100 })
  }

  handleEval = grade => {
    const { gradeText } = this.props
    const { focusedText } = this.state

    if (!focusedText) {
      return
    }

    const id = focusedText.get('id')
    gradeText(id, grade)
    this.setState({ focusedText: null })
  }

  render() {
    const { texts, user } = this.props
    const { focusedText } = this.state

    return (
      <Box grow>
        <EvalBox>
          <TextList
            onClick={focusedText => this.setState({ focusedText })}
            texts={texts}
            focusedText={focusedText}
            width={250}
          />
          <Box grow>
            {user && (
              <EvalActions>
                <b>{'Evaluate:'}</b>
                {actions.map((a, i) => (
                  <Button
                    key={a}
                    smallPad
                    noHeight
                    onClick={() => this.handleEval(i === 0 ? -1 : i)}
                  >
                    {a}
                  </Button>
                ))}
              </EvalActions>
            )}
            <Box grow relative>
              <Box sticky scrollable>
                <TextContent>{focusedText && focusedText.get('raw')}</TextContent>
              </Box>
            </Box>
          </Box>
        </EvalBox>
      </Box>
    )
  }
}

export default Eval
