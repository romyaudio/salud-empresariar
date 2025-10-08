import { TransactionModel } from '../Transaction'

describe('TransactionModel', () => {
  describe('formatAmount', () => {
    it('formats positive amounts correctly', () => {
      const result = TransactionModel.formatAmount(1000)
      expect(result).toContain('1.000')
      expect(result).toContain('$')
    })

    it('formats zero correctly', () => {
      const result = TransactionModel.formatAmount(0)
      expect(result).toContain('0')
      expect(result).toContain('$')
    })

    it('formats negative amounts correctly', () => {
      const result = TransactionModel.formatAmount(-1000)
      expect(result).toContain('1.000')
      expect(result).toContain('-')
    })

    it('handles decimal places correctly', () => {
      const result = TransactionModel.formatAmount(1234.56)
      expect(result).toContain('1.234')
    })
  })

  describe('validate', () => {
    const today = new Date().toISOString().split('T')[0]
    const validTransaction = {
      type: 'income' as const,
      amount: '1000',
      description: 'Test transaction',
      category: 'Test Category',
      date: today
    }

    it('validates correct transaction', () => {
      const result = TransactionModel.validate(validTransaction)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('validates required fields', () => {
      const invalidTransaction = {
        ...validTransaction,
        amount: '',
        description: ''
      }
      
      const result = TransactionModel.validate(invalidTransaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('validates amount format', () => {
      const invalidTransaction = {
        ...validTransaction,
        amount: 'invalid'
      }
      
      const result = TransactionModel.validate(invalidTransaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('número'))).toBe(true)
    })

    it('validates positive amounts', () => {
      const invalidTransaction = {
        ...validTransaction,
        amount: '-100'
      }
      
      const result = TransactionModel.validate(invalidTransaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('mayor a 0'))).toBe(true)
    })

    it('validates description requirement', () => {
      const invalidTransaction = {
        ...validTransaction,
        description: '' // Empty
      }
      
      const result = TransactionModel.validate(invalidTransaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('requerida'))).toBe(true)
    })

    it('validates future dates', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      
      const invalidTransaction = {
        ...validTransaction,
        date: futureDate.toISOString().split('T')[0]
      }
      
      const result = TransactionModel.validate(invalidTransaction)
      expect(result.isValid).toBe(false)
      expect(result.errors.some(error => error.includes('futura'))).toBe(true)
    })
  })

  describe('calculateTotals', () => {
    const transactions = [
      { type: 'income' as const, amount: 1000 },
      { type: 'expense' as const, amount: 300 },
      { type: 'income' as const, amount: 500 },
      { type: 'expense' as const, amount: 200 }
    ]

    it('calculates totals correctly', () => {
      const totals = TransactionModel.calculateTotals(transactions as any)
      expect(totals.income).toBe(1500) // 1000 + 500
      expect(totals.expenses).toBe(500) // 300 + 200
      expect(totals.balance).toBe(1000) // 1500 - 500
    })

    it('handles empty transactions', () => {
      const totals = TransactionModel.calculateTotals([])
      expect(totals.income).toBe(0)
      expect(totals.expenses).toBe(0)
      expect(totals.balance).toBe(0)
    })

    it('handles only income transactions', () => {
      const incomeOnly = [
        { type: 'income' as const, amount: 1000 },
        { type: 'income' as const, amount: 500 }
      ]
      const totals = TransactionModel.calculateTotals(incomeOnly as any)
      expect(totals.income).toBe(1500)
      expect(totals.expenses).toBe(0)
      expect(totals.balance).toBe(1500)
    })

    it('handles only expense transactions', () => {
      const expenseOnly = [
        { type: 'expense' as const, amount: 300 },
        { type: 'expense' as const, amount: 200 }
      ]
      const totals = TransactionModel.calculateTotals(expenseOnly as any)
      expect(totals.income).toBe(0)
      expect(totals.expenses).toBe(500)
      expect(totals.balance).toBe(-500)
    })
  })
})