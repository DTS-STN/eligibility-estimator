/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Eligibility from '../../pages/eligibility/index'
import React from 'react'
import * as nextRouter from 'next/router'

describe('index page', () => {
  let useRouter
  // mocking useRouter, as we'll eventually need it for sedning the correct requests
  beforeAll(() => {
    useRouter = jest.spyOn(nextRouter, 'useRouter')
    useRouter.mockImplementation(() => ({
      route: '/elgibility',
      pathname: '/elgibility?income=20000',
      query: '',
      asPath: '',
    }))
  })

  it('should render the home page', async () => {
    render(React.createElement(Eligibility))
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
