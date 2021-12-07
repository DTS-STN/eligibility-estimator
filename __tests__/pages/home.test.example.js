/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../pages/index'

describe('index page', () => {
  let useRouter, data
  // mocking useRouter, as we'll eventually need it for sedning the correct requests
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
    // Once API is ready, fetch here
    render(React.createElement(Home, { data }))
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
