/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as nextRouter from 'next/router'
import React from 'react'
import Eligibility from '../../pages/eligibility/index'

// describe('index page', () => {
//   let useRouter

//   beforeAll(() => {
//     useRouter = jest.spyOn(nextRouter, 'useRouter')
//     useRouter.mockImplementation(() => ({
//       route: '/eligibility',
//       pathname: '/eligibility?income=20000',
//       query: '',
//       asPath: '',
//     }))
//   })

//   // it('should render the home page', async () => {
//   //   // render(React.createElement(Eligibility))
//   //   // const main = screen.getByRole('main')
//   //   // expect(main).toBeInTheDocument()
//   // })
// })
