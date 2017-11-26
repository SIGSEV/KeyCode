import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import TextList from 'components/TextList'
import Button from 'components/Button'

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

const actions = ['1 - Baby text', '2 - Easy', '3 - Medium', '4 - Hard', '5 - Hardcore']

class Eval extends PureComponent {
  handleDelete = () => alert('deleting')
  handleEval = level => alert(`evaluating ${level}`)

  render() {
    return (
      <Box grow>
        <EvalBox>
          <TextList width={250} />
          <Box grow>
            <EvalActions>
              <b>{'Evaluate:'}</b>
              <Button smallPad noHeight onClick={this.handleDelete}>
                {'0 - Shit'}
              </Button>
              {actions.map((a, i) => (
                <Button key={a} smallPad noHeight onClick={() => this.handleEval(i + 1)}>
                  {a}
                </Button>
              ))}
            </EvalActions>
            <Box grow relative>
              <Box sticky scrollable>
                <TextContent>
                  {
                    'this is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\nthis is the text content\n'
                  }
                </TextContent>
              </Box>
            </Box>
          </Box>
        </EvalBox>
      </Box>
    )
  }
}

export default Eval
