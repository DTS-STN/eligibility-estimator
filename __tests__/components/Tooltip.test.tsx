/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { LanguageProvider, StoreProvider } from '../../components/Contexts'
import { Tooltip } from '../../components/Tooltip/tooltip'
import { fieldDefinitions } from '../../components/Tooltip/index'

// gets data correctly and presents it
describe('Tooltip component', () => {
  it('can render an input component that is required component', () => {
    const props = {
      field: 'income',
    }

    const ui = (
      <StoreProvider>
        <LanguageProvider>
          <Tooltip field={props.field} />
        </LanguageProvider>
      </StoreProvider>
    )

    render(ui)

    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip.textContent).toContain(fieldDefinitions.data[props.field][0]) // tooltip title
    expect(tooltip.innerHTML).toContain(fieldDefinitions.data[props.field][0]) // tooltip content
  })

  // throws if tooltip not found
  it('should throw if the tooltip cannot be found by key', () => {
    const props = {
      field: 'fakeKey',
    }

    const ui = (
      <StoreProvider>
        <LanguageProvider>
          <Tooltip field={props.field} />
        </LanguageProvider>
      </StoreProvider>
    )

    expect(() => render(ui)).toThrowError(
      `Tooltip with key "fakeKey" not found in internationalization file.`
    )
  })
})
