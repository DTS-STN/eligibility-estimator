/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { LanguageProvider, StoreProvider } from '../../components/Contexts'
import {
  getTooltipTranslationByField,
  Tooltip,
} from '../../components/Tooltip/tooltip'
import { Language } from '../../utils/api/definitions/enums'

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
    expect(tooltip.textContent).toContain(
      getTooltipTranslationByField(Language.EN, props.field).heading
    )
    expect(tooltip.innerHTML).toContain(
      getTooltipTranslationByField(Language.EN, props.field).text
    )
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
