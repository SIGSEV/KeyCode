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

const actions = ['1 - Baby text', '2 - Easy', '3 - Medium', '4 - Hard', '5 - Hardcore']

class Eval extends PureComponent {
  render() {
    return (
      <Box grow>
        <EvalBox>
          <TextList width={250} />
          <Box grow>
            <EvalActions>
              <b>{'Evaluate:'}</b>
              {actions.map(a => (
                <Button key={a} smallPad noHeight>
                  {a}
                </Button>
              ))}
            </EvalActions>
            <Box relative>
              <Box sticky scrollable>
                <div>onetuhoenth</div>
              </Box>
            </Box>
          </Box>
        </EvalBox>
      </Box>
    )
  }
}

export default Eval
