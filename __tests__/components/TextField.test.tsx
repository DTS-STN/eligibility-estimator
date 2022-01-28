/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { LanguageProvider, StoreProvider } from '../../components/Contexts'
import { TextField } from '../../components/Forms/TextField'

describe('TextField component', () => {
  it('should render an input component that is required component', () => {
    const props = {
      name: 'legalStatusOther',
      label: 'Describe your legal status?',
      required: true,
    }

    const ui = (
      <StoreProvider>
        <LanguageProvider>
          <TextField
            name={props.name}
            label={props.label}
            required={props.required}
          />
        </LanguageProvider>
      </StoreProvider>
    )

    render(ui)
    const label = screen.getByTestId('text-input-label')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
    expect(label.textContent).toContain(props.label)

    const field = screen.getByTestId('text-input')
    expect(field).toBeInTheDocument()
    expect(field.tagName).toBe('TEXTAREA')
    expect(field).toBeDefined()
    expect(field).toBeRequired()
  })

  it('should render an input component that is required and has a custom error message', () => {
    const props = {
      name: 'legalStatusOther',
      label: 'Describe your legal status?',
      error: 'This field is required.',
      required: true,
    }

    const ui = (
      <StoreProvider>
        <LanguageProvider>
          <TextField
            name={props.name}
            label={props.label}
            error={props.error}
            required={props.required}
          />
        </LanguageProvider>
      </StoreProvider>
    )

    render(ui)
    const label = screen.getByTestId('text-input-label')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
    expect(label.textContent).toContain(props.label)

    const field = screen.getByTestId('text-input')
    expect(field).toBeInTheDocument()
    expect(field.tagName).toBe('TEXTAREA')
    expect(field).toBeDefined()
    expect(field).toBeRequired()

    const errorLabel = screen.getByRole('alert')
    expect(errorLabel).toBeDefined()
    expect(errorLabel.textContent).toBe(props.error)
  })
})
