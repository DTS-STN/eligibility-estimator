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
  // mocking useRouter, as we'll eventually need it for sending the correct requests
  beforeAll(() => {
    useRouter = jest.spyOn(nextRouter, 'useRouter')
    useRouter.mockImplementation(() => ({
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
    }))
  })

  it('should render the home page', async () => {
    render(React.createElement(Home))
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
