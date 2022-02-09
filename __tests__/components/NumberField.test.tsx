/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { StoreProvider } from '../../components/Contexts'
import { NumberField } from '../../components/Forms/NumberField'

describe('NumberField component', () => {
  it('should render an input component that is required component', () => {
    const props = {
      name: 'age',
      label: 'What is your age?',
      required: true,
    }

    const ui = (
      <StoreProvider>
        <NumberField
          name={props.name}
          label={props.label}
          required={props.required}
        />
      </StoreProvider>
    )

    render(ui)
    const label = screen.getByTestId('number-input-label')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
    expect(label.textContent).toContain(props.label)

    const field = screen.getByTestId('number-input')
    expect(field).toBeInTheDocument()
    expect(field.tagName).toBe('INPUT')
    expect(field).toBeDefined()
    expect(field).toBeRequired()
  })

  it('should render an input component that is required and has a custom error message', () => {
    const props = {
      name: 'age',
      label: 'What is your age?',
      error: 'This field is required.',
      required: true,
    }

    const ui = (
      <StoreProvider>
        <NumberField
          name={props.name}
          label={props.label}
          error={props.error}
          required={props.required}
        />
      </StoreProvider>
    )

    render(ui)
    const label = screen.getByTestId('number-input-label')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
    expect(label.textContent).toContain(props.label)

    const field = screen.getByTestId('number-input')
    expect(field).toBeInTheDocument()
    expect(field.tagName).toBe('INPUT')
    expect(field).toBeDefined()
    expect(field).toBeRequired()

    const errorLabel = screen.getByRole('alert')
    expect(errorLabel).toBeDefined()
    expect(errorLabel.textContent).toBe(props.error)
  })
})
