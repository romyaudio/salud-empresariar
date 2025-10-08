import { renderHook, act } from '@testing-library/react'
import { useErrorHandler } from '../useErrorHandler'

describe('useErrorHandler', () => {
  it('adds and removes errors', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    expect(result.current.errors).toHaveLength(0)
    
    let errorId: string
    act(() => {
      errorId = result.current.addError({
        message: 'Test error',
        type: 'validation'
      })
    })
    
    expect(result.current.errors).toHaveLength(1)
    expect(result.current.errors[0].message).toBe('Test error')
    expect(result.current.errors[0].type).toBe('validation')
    
    act(() => {
      result.current.removeError(errorId)
    })
    
    expect(result.current.errors).toHaveLength(0)
  })

  it('handles network errors', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.handleNetworkError('Connection failed')
    })
    
    expect(result.current.errors).toHaveLength(1)
    expect(result.current.errors[0].type).toBe('network')
    expect(result.current.errors[0].title).toBe('Error de Conexión')
    expect(result.current.errors[0].message).toBe('Connection failed')
  })

  it('handles validation errors', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.handleValidationError('Invalid input', 'email')
    })
    
    expect(result.current.errors).toHaveLength(1)
    expect(result.current.errors[0].type).toBe('validation')
    expect(result.current.errors[0].title).toBe('Error en email')
    expect(result.current.errors[0].message).toBe('Invalid input')
  })

  it('handles auth errors', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.handleAuthError('Session expired')
    })
    
    expect(result.current.errors).toHaveLength(1)
    expect(result.current.errors[0].type).toBe('auth')
    expect(result.current.errors[0].title).toBe('Error de Autenticación')
    expect(result.current.errors[0].message).toBe('Session expired')
  })

  it('handles server errors', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.handleServerError('Internal server error')
    })
    
    expect(result.current.errors).toHaveLength(1)
    expect(result.current.errors[0].type).toBe('server')
    expect(result.current.errors[0].title).toBe('Error del Servidor')
    expect(result.current.errors[0].message).toBe('Internal server error')
  })

  it('clears all errors', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.addError({ message: 'Error 1' })
      result.current.addError({ message: 'Error 2' })
    })
    
    expect(result.current.errors).toHaveLength(2)
    
    act(() => {
      result.current.clearAllErrors()
    })
    
    expect(result.current.errors).toHaveLength(0)
  })

  it('handles generic errors with context', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const testError = new Error('Something went wrong')
    
    act(() => {
      result.current.handleError(testError, 'User action')
    })
    
    expect(result.current.errors).toHaveLength(1)
    expect(result.current.errors[0].type).toBe('unknown')
    expect(result.current.errors[0].message).toContain('Something went wrong')
  })
})