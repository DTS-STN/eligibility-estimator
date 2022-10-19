/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import { Radio } from '../../components/Forms/Radio'

describe('Radio component', () => {
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
      name: 'everLivedSocialCountry',
      label: 'Have you ever live in a social agreement country?',
      required: true,
      values: [
        { key: 'true', text: 'Yes', shortText: 'Yes' },
        { key: 'false', text: 'No', shortText: 'No' },
      ],
    }

    const ui = (
      <Radio
        name={props.name}
        keyforid={props.name}
        label={props.label}
        required={props.required}
        values={props.values}
        onChange={(e) => e.preventDefault()}
      />
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
      expect(field.value).toEqual(props.values[index].key)
    }
  })

  it('should render an input component that has a checkedValue', () => {
    const props = {
      name: 'everLivedSocialCountry',
      label: 'Have you ever live in a social agreement country?',
      required: true,
      values: [
        { key: 'true', text: 'Yes', shortText: 'Yes' },
        { key: 'false', text: 'No', shortText: 'No' },
      ],
      checkedValue: 'true',
    }

    const ui = (
      <Radio
        name={props.name}
        keyforid={props.name}
        label={props.label}
        required={props.required}
        values={props.values}
        checkedValue={props.checkedValue}
        onChange={(e) => e.preventDefault()}
      />
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
      expect(field.value).toEqual(props.values[index].key)
    }

    expect((fields[0] as Partial<HTMLInputElement>).checked).toEqual(true)
    expect((fields[1] as Partial<HTMLInputElement>).checked).toEqual(false)
  })
})
