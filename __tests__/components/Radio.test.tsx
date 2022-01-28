/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { LanguageProvider, StoreProvider } from '../../components/Contexts'
import { Radio } from '../../components/Forms/Radio'

describe('Radio component', () => {
  it('should render an input component that is required component', () => {
    const props = {
      name: 'everLivedSocialCountry',
      label: 'Have you ever live in a social agreement country?',
      required: true,
      values: [
        { key: 'true', text: 'Yes' },
        { key: 'false', text: 'No' },
      ],
    }

    const ui = (
      <StoreProvider>
        <LanguageProvider>
          <Radio
            name={props.name}
            keyforid={props.name}
            label={props.label}
            required={props.required}
            values={props.values}
            onChange={(e) => e.preventDefault()}
          />
        </LanguageProvider>
      </StoreProvider>
    )
    render(ui)

    const label = screen.getByTestId('radio-label')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
    expect(label.textContent).toContain(props.label)

    const fields = screen.getAllByTestId('radio')
    for (let index = 0; index < fields.length; index++) {
      const field: Partial<HTMLInputElement> = fields[index]

      expect(field).toBeInTheDocument()
      expect(field.tagName).toBe('INPUT')
      expect(field).toBeDefined()
      expect(field).toBeRequired()
      expect(field.value).toEqual(props.values[index].key)
    }
  })

  it('should render an input component that has a checkedValue', () => {
    const props = {
      name: 'everLivedSocialCountry',
      label: 'Have you ever live in a social agreement country?',
      required: true,
      values: [
        { key: 'true', text: 'Yes' },
        { key: 'false', text: 'No' },
      ],
      checkedValue: 'true',
    }

    const ui = (
      <StoreProvider>
        <LanguageProvider>
          <Radio
            name={props.name}
            keyforid={props.name}
            label={props.label}
            required={props.required}
            values={props.values}
            checkedValue={props.checkedValue}
            onChange={(e) => e.preventDefault()}
          />
        </LanguageProvider>
      </StoreProvider>
    )
    render(ui)

    const label = screen.getByTestId('radio-label')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
    expect(label.textContent).toContain(props.label)

    const fields = screen.getAllByTestId('radio')
    for (let index = 0; index < fields.length; index++) {
      const field: Partial<HTMLInputElement> = fields[index]

      expect(field).toBeInTheDocument()
      expect(field.tagName).toBe('INPUT')
      expect(field).toBeDefined()
      expect(field).toBeRequired()
      expect(field.value).toEqual(props.values[index].key)
    }

    expect((fields[0] as Partial<HTMLInputElement>).checked).toEqual(true)
    expect((fields[1] as Partial<HTMLInputElement>).checked).toEqual(false)
  })
})
