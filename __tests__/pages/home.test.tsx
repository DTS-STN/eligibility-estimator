/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Home from '../../pages/index'

describe('index page', () => {
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

  it('should render the home page', async () => {
    const ui = <Home adobeAnalyticsUrl={''} />
    render(ui)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  jest.setTimeout(90 * 1000)
  expect.extend(toHaveNoViolations)

  it('has no a11y violations', async () => {
    const { container } = render(<Home adobeAnalyticsUrl={''} />)

    //waitFor avoids getting the warning it must wrap in 'act'.

    const results = await waitFor(() => {
      axe(container)
    })

    await waitFor(() => {
      expect(results).toHaveNoViolations
    })
  })
})
