/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { LanguageProvider, StoreProvider } from '../../components/Contexts'
import { CurrencyField } from '../../components/Forms/CurrencyField'

describe('CurrencyField component', () => {
  it('should render an input component that is required component', () => {
    const props = {
      name: 'income',
      label: 'What is your annual net income?',
      required: true,
    }

    const ui = (
      <StoreProvider>
        <LanguageProvider>
          <CurrencyField
            name={props.name}
            label={props.label}
            required={props.required}
          />
        </LanguageProvider>
      </StoreProvider>
    )

    render(ui)
    const label = screen.getByTestId('currency-input-label')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
    expect(label.textContent).toContain(props.label)

    const field = screen.getByTestId('currency-input')
    expect(field).toBeInTheDocument()
    expect(field.tagName).toBe('INPUT')
    expect(field).toBeDefined()
    expect(field).toBeRequired()
  })

  it('should render an input component that is required and has a custom error message', () => {
    const props = {
      name: 'income',
      label: 'What is your annual net income?',
      error: 'This field is required.',
      required: true,
    }

    const ui = (
      <StoreProvider>
        <LanguageProvider>
          <CurrencyField
            name={props.name}
            label={props.label}
            error={props.error}
            required={props.required}
          />
        </LanguageProvider>
      </StoreProvider>
    )

    render(ui)
    const label = screen.getByTestId('currency-input-label')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
    expect(label.textContent).toContain(props.label)

    const field = screen.getByTestId('currency-input')
    expect(field).toBeInTheDocument()
    expect(field.tagName).toBe('INPUT')
    expect(field).toBeDefined()
    expect(field).toBeRequired()

    const errorLabel = screen.getByRole('alert')
    expect(errorLabel).toBeDefined()
    expect(errorLabel.textContent).toBe(props.error)
  })
})
