import { cn, formatCurrency, formatDate, generateId, validateEmail, validateAmount } from '../utils'

describe('utils', () => {
  describe('cn (className utility)', () => {
    it('merges class names correctly', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toBe('base-class additional-class')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      )
      
      expect(result).toBe('base-class active-class')
    })

    it('handles undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'valid-class')
      expect(result).toBe('base-class valid-class')
    })

    it('handles empty strings', () => {
      const result = cn('base-class', '', 'valid-class')
      expect(result).toBe('base-class valid-class')
    })

    it('returns empty string for no valid inputs', () => {
      const result = cn(null, undefined, false, '')
      expect(result).toBe('')
    })

    it('handles multiple classes', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toBe('px-2 py-1 px-4')
    })
  })

  describe('formatCurrency', () => {
    it('formats currency with default COP', () => {
      const result = formatCurrency(1500.50)
      expect(result).toContain('1.500,50')
    })

    it('formats currency with custom currency', () => {
      const result = formatCurrency(1500.50, 'USD')
      expect(result).toContain('1.500,50')
    })

    it('handles zero amount', () => {
      const result = formatCurrency(0)
      expect(result).toContain('0')
    })

    it('handles negative amounts', () => {
      const result = formatCurrency(-1500.50)
      expect(result).toContain('-')
    })
  })

  describe('formatDate', () => {
    it('formats date with short format', () => {
      const result = formatDate('2024-01-15')
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })

    it('formats date with long format', () => {
      const result = formatDate('2024-01-15', 'long')
      expect(result).toContain('2024')
    })

    it('handles Date objects', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(typeof id2).toBe('string')
    })

    it('generates non-empty IDs', () => {
      const id = generateId()
      expect(id.length).toBeGreaterThan(0)
    })
  })

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test.example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validateAmount', () => {
    it('validates positive amounts', () => {
      expect(validateAmount('100')).toBe(true)
      expect(validateAmount('1500.50')).toBe(true)
      expect(validateAmount('0.01')).toBe(true)
    })

    it('rejects invalid amounts', () => {
      expect(validateAmount('0')).toBe(false)
      expect(validateAmount('-100')).toBe(false)
      expect(validateAmount('invalid')).toBe(false)
      expect(validateAmount('')).toBe(false)
      expect(validateAmount('abc123')).toBe(false)
    })
  })
})