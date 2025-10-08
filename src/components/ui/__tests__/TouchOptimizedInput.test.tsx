import { render, screen, fireEvent } from '@testing-library/react'
import { TouchOptimizedInput } from '../TouchOptimizedInput'

describe('TouchOptimizedInput', () => {
  it('renders with label', () => {
    render(<TouchOptimizedInput label="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('handles input changes', () => {
    const handleChange = jest.fn()
    render(
      <TouchOptimizedInput 
        label="Test Input" 
        onChange={handleChange}
      />
    )
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('shows error message', () => {
    render(
      <TouchOptimizedInput 
        label="Test Input" 
        error="This is an error"
      />
    )
    
    expect(screen.getByText('This is an error')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    render(
      <TouchOptimizedInput 
        label="Test Input" 
        icon="🔍"
      />
    )
    
    expect(screen.getByText('🔍')).toBeInTheDocument()
  })

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    
    render(
      <TouchOptimizedInput 
        label="Test Input"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    )
    
    const input = screen.getByRole('textbox')
    
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalled()
    
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalled()
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <TouchOptimizedInput 
        label="Disabled Input" 
        disabled
      />
    )
    
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})