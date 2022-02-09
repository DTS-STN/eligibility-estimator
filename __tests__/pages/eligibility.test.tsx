/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import { StoreProvider } from '../../components/Contexts'
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
    }))
  })

  it('should render the eligibility page', async () => {
    const res = await mockPartialGetRequest({
      income: 20000,
    })

    const ui = (
      <StoreProvider>
        <Eligibility {...res.body} />
      </StoreProvider>
    )
    render(ui)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
