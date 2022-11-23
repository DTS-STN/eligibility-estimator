/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import { axe } from 'jest-axe'
import Eligibility from '../../pages/eligibility/index'
import { mockPartialGetRequest } from './api/factory'

describe('index page', () => {
  let useRouter

  beforeAll(() => {
    useRouter = jest.spyOn(nextRouter, 'useRouter')
    useRouter.mockImplementation(() => ({
      route: '/eligibility',
      pathname: '/eligibility?income=20000',
      query: { income: '20000' },
      asPath: '',
      locale: 'en',
      locales: ['en', 'fr'],
    }))
  })

  it('should render the eligibility page', async () => {
    const res = await mockPartialGetRequest({
      income: 20000,
    })

    const ui = <Eligibility adobeAnalyticsUrl={''} {...res.body} />
    render(ui)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  jest.setTimeout(90 * 1000)

  it('has no a11y violations', async () => {
    const res = await mockPartialGetRequest({
      income: 20000,
    })

    const { container } = render(
      <Eligibility adobeAnalyticsUrl={''} {...res.body} />
    )
    const results = await waitFor(() => {
      axe(container)
    })

    await waitFor(() => {
      expect(results).toHaveNoViolations
    })
  })
})
