import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

describe('Home Page Tests', () => {
  beforeEach(() => {
    // Set environment to test
    process.env.NODE_ENV = 'test'
    process.env.NEXT_PUBLIC_SECRET_KEY = 'test-key-123'
  })

  it('renders without crashing in CI', () => {
    render(<Home />)
    
    // Check if page renders
    expect(screen.getByText(/PASSING IN TESTS/i)).toBeInTheDocument()
  })

  it('shows API key status correctly', () => {
    render(<Home />)
    
    // Check API key message
    expect(screen.getByText(/API Key status: ✅ Present/i)).toBeInTheDocument()
  })

  it('has all buttons in CI environment', () => {
    render(<Home />)
    
    // Check if all buttons are present
    expect(screen.getByText(/Call API/)).toBeInTheDocument()
    expect(screen.getByText(/Crash Recursive/)).toBeInTheDocument()
    expect(screen.getByText(/Click 0 times/)).toBeInTheDocument()
  })

  it('shows correct environment', () => {
    render(<Home />)
    
    // Check environment display
    expect(screen.getByText(/Environment: test/i)).toBeInTheDocument()
  })

  // This test will pass but doesn't catch production issues
  it('passes even with production checks', () => {
    // Try production mode
    process.env.NODE_ENV = 'production'
    
    // This won't crash because we're not actually in browser
    expect(() => render(<Home />)).not.toThrow()
  })
})