import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Container from 'components/base/Container'
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

class Eval extends PureComponent {
  render() {
    return (
      <Container>
        <EvalBox>
          <TextList width={250} />
          <Container>
            <EvalActions>
              <b>{'Evaluate:'}</b>
              <Button smallPad noHeight>
                {'1 - Baby text'}
              </Button>
              <Button smallPad noHeight>
                {'2 - Easy'}
              </Button>
              <Button smallPad noHeight>
                {'3 - Medium'}
              </Button>
              <Button smallPad noHeight>
                {'4 - Hard'}
              </Button>
              <Button smallPad noHeight>
                {'5 - Hardcore'}
              </Button>
            </EvalActions>
            <Container relative>
              <Container sticky scrollable>
                <div>onetuhoenth</div>
              </Container>
            </Container>
          </Container>
        </EvalBox>
      </Container>
    )
  }
}

export default Eval
