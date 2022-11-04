/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import {
  getTooltipTranslationByField,
  Tooltip,
} from '../../components/Tooltip/tooltip'
import { getTooltipTranslations } from '../../i18n/tooltips'
import { Language } from '../../utils/api/definitions/enums'

describe('Tooltip component', () => {
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

  it('can render an input component that is required component', () => {
    const field = 'legalStatus'
    const ui = <Tooltip field={field} />
    render(ui)

    const tooltip = screen.getByTestId('tooltip-text')
    const tooltipData = getTooltipTranslationByField(Language.EN, field)
    expect(tooltip.innerHTML).toContain(normalizeHtml(tooltipData.text))
  })

  it('ensures English and French have the same number of tooltip translations', () => {
    const en = getTooltipTranslations(Language.EN)
    const fr = getTooltipTranslations(Language.FR)
    expect(Object.keys(en).length).toEqual(Object.keys(fr).length)
  })
})

function normalizeHtml(html: string) {
  let element = document.createElement('div')
  element.innerHTML = html
  return element.innerHTML
}
