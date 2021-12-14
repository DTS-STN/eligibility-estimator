/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import Home from '../../pages/interact'

describe('index page', () => {
  let useRouter, data
  // mocking useRouter, as we'll eventually need it for sending the correct requests
  beforeAll(() => {
    useRouter = jest.spyOn(nextRouter, 'useRouter')
    useRouter.mockImplementation(() => ({
      route: '/interact',
      pathname: '/',
      query: '',
      asPath: '',
    }))
  })

  it('should render the home page', async () => {
    // Once API is ready, fetch here
    render(React.createElement(Home))
  })
})
