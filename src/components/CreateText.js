import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Field as FormField, Form as FormikForm, Formik } from 'formik'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { languages, textConds } from 'helpers/text'
import { createText } from 'actions/text'
import { loadRace } from 'actions/race'

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

@connect(null, {
  createText,
  loadRace,
  push,
})
class CreateText extends PureComponent {
  render() {
    const { createText, loadRace, push } = this.props

    return (
      <Narrow>
        <Formik
          onSubmit={async (values, props) => {
            try {
              const text = await createText(values)
              await loadRace(text.id)
              props.setSubmitting(false)
              push(`/r/${text.id}`)
            } catch (err) {
              props.setSubmitting(false)
            }
          }}
          initialValues={{
            title: '',
            raw: '',
            language: '',
          }}
          validate={values => {
            const errors = {}
            if (!values.title) {
              errors.title = 'Required'
            }
            if (!values.raw) {
              errors.raw = 'Required'
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
                    <Field name="title" placeholder="My own race" autoFocus />
                  </FormGroup>
                  <FormGroup>
                    <Label>{'Language'}</Label>

                    <FormField name="language">
                      {({ field }) => (
                        <FormSelect onChange={field.onChange}>
                          <option value="">{'Select language...'}</option>
                          {languages.map(l => (
                            <option key={l} value={l}>
                              {l}
                            </option>
                          ))}
                        </FormSelect>
                      )}
                    </FormField>
                  </FormGroup>
                </Row>
                <FormGroup>
                  <Label>{'Content'}</Label>
                  <TextareaField
                    component="textarea"
                    name="raw"
                    placeholder={`${textConds.min}-${textConds.max} chars`}
                  />
                </FormGroup>
                <Button isLoading={props.isSubmitting} isDisabled={!props.isValid}>
                  {'Create'}
                </Button>
              </Form>
            )
          }}
        />
      </Narrow>
    )
  }
}

export default CreateText
