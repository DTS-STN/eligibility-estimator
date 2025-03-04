/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import { CurrencyField } from '../../components/Forms/CurrencyField'

describe('CurrencyField component', () => {
  let useRouter

  beforeAll(() => {
    useRouter = jest.spyOn(nextRouter, 'useRouter')
    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      locale: 'en',
      locales: ['en', 'fr'],
    }))
  })
  it('should render an input component that is required component', () => {
    const props = {
      name: 'income',
      label: 'What is your annual net income?',
      requiredText: 'Required',
    }

    const ui = (
      <CurrencyField
        name={props.name}
        label={props.label}
        requiredText={props.requiredText}
      />
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
      requiredText: 'Required',
    }

    const ui = (
      <CurrencyField
        name={props.name}
        label={props.label}
        error={props.error}
        requiredText={props.requiredText}
      />
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
