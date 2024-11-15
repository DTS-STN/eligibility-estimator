/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import { axe } from 'jest-axe'
import Questions from '../../pages/questions/index'
import { mockPartialGetRequest } from '../utils/factory'

jest.mock('next/link', () => {
  return ({ children }) => children
})

describe('index page', () => {
  let useRouter

  beforeAll(() => {
    useRouter = jest.spyOn(nextRouter, 'useRouter')
    useRouter.mockImplementation(() => ({
      route: '/questions',
      pathname: '/questions',
      query: { income: '20000', step: 'marital' },
      asPath: '',
      locale: 'en',
      locales: ['en', 'fr'],
    }))
  })

  it('should render the questions page', async () => {
    const res = await mockPartialGetRequest({
      income: 20000,
    })

    const ui = <Questions adobeAnalyticsUrl={''} {...res.body} />
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
      <Questions adobeAnalyticsUrl={''} {...res.body} />
    )
    const results = await waitFor(() => {
      axe(container)
    })

    await waitFor(() => {
      expect(results).toHaveNoViolations
    })
  })
})
