import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Field as FormField, Form as FormikForm, Formik } from 'formik'

import Button from 'components/Button'

const Narrow = styled.div`
  max-width: 860px;
  margin: 0 auto;
`

const Form = styled(FormikForm)`
  > * + * {
    margin-top: 40px;
  }
`

const Field = styled(FormField)`
  border: 1px solid ${p => p.theme.lightgrey01};
  height: 40px;
  min-width: 300px;
  padding: 0 10px;

  &::placeholder {
    color: ${p => p.theme.lightgrey01};
  }

  &:focus {
    outline: none;
    border-color: ${p => p.theme.accent};
    box-shadow: rgba(0, 0, 0, 0.1) 0 2px 5px;
  }
`

const FormSelect = styled.select`
  border: 1px solid ${p => p.theme.lightgrey01};
  height: 40px;
  min-width: 300px;
  padding: 0 10px;

  &::placeholder {
    color: ${p => p.theme.lightgrey01};
  }

  &:focus {
    outline: none;
    border-color: ${p => p.theme.accent};
    box-shadow: rgba(0, 0, 0, 0.1) 0 2px 5px;
  }
`

const TextareaField = Field.extend`
  height: auto;
  width: 100%;
  min-height: 200px;
  padding: 10px;
  font-family: monospace;
`

const FormGroup = styled.div`
  > * + * {
    margin-top: 10px;
  }
`

const Label = styled.div`
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
`

const Row = styled.div`
  display: flex;
  align-items: flex-start;

  > * + * {
    margin-left: 40px;
  }
`

class CreateText extends PureComponent {
  render() {
    return (
      <Narrow>
        <Formik
          onSubmit={values => {
            console.log(values)
          }}
          initialValues={{
            name: '',
            content: '',
            language: '',
          }}
          validate={values => {
            const errors = {}
            if (!values.name) {
              errors.name = 'Required'
            }
            if (!values.content) {
              errors.content = 'Required'
            }
            if (!values.language) {
              errors.language = 'Required'
            }
            return errors
          }}
          render={props => {
            return (
              <Form>
                <Row>
                  <FormGroup>
                    <Label>{'Title'}</Label>
                    <Field name="name" placeholder="My own race" autoFocus />
                  </FormGroup>
                  <FormGroup>
                    <Label>{'Language'}</Label>

                    <FormField>
                      {({ field }) => {
                        return (
                          <FormSelect name="language" onChange={field.onChange}>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                          </FormSelect>
                        )
                      }}
                    </FormField>
                  </FormGroup>
                </Row>
                <FormGroup>
                  <Label>{'Content'}</Label>
                  <TextareaField component="textarea" name="content" placeholder="Hello world..." />
                </FormGroup>
                <Button isDisabled={!props.isValid}>{'Create'}</Button>
              </Form>
            )
          }}
        />
      </Narrow>
    )
  }
}

export default CreateText
