/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Index from '../../pages/index'

describe('index page', () => {
  it('should render', () => {
    render(<Index />)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
