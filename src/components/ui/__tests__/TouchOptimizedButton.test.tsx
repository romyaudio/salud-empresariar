import { render, screen, fireEvent } from '@testing-library/react'
import { TouchOptimizedButton } from '../TouchOptimizedButton'

describe('TouchOptimizedButton', () => {
  it('renders with children', () => {
    render(<TouchOptimizedButton>Test Button</TouchOptimizedButton>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(
      <TouchOptimizedButton onClick={handleClick}>
        Click me
      </TouchOptimizedButton>
    )
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(
      <TouchOptimizedButton loading>
        Loading Button
      </TouchOptimizedButton>
    )
    
    expect(screen.getByText('Loading Button')).toBeInTheDocument()
    // Button should be disabled when loading
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <TouchOptimizedButton variant="primary">
        Primary
      </TouchOptimizedButton>
    )
    
    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
    
    rerender(
      <TouchOptimizedButton variant="danger">
        Danger
      </TouchOptimizedButton>
    )
    
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-600')
  })

  it('renders with icon', () => {
    render(
      <TouchOptimizedButton icon="🚀">
        With Icon
      </TouchOptimizedButton>
    )
    
    expect(screen.getByText('🚀')).toBeInTheDocument()
    expect(screen.getByText('With Icon')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <TouchOptimizedButton disabled>
        Disabled Button
      </TouchOptimizedButton>
    )
    
    expect(screen.getByRole('button')).toBeDisabled()
  })
})