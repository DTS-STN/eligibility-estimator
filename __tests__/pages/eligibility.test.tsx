/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import Eligibility from '../../pages/eligibility/index'
import { LanguageProvider, StoreProvider } from '../../components/Contexts'
import { ResponseSuccess } from '../../utils/api/definitions/types'
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
      income: '20000' as unknown as number,
    })

    const ui = (
      <StoreProvider>
        <LanguageProvider>
          <Eligibility {...res.body} />
        </LanguageProvider>
      </StoreProvider>
    )
    render(ui)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
