/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
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
    const ui = <Home />
    render(ui)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
