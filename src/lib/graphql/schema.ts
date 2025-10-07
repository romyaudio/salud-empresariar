// GraphQL Schema definitions for Budget Tracker

export const typeDefs = `
  type Transaction @model @auth(rules: [{ allow: owner }]) {
    id: ID!
    type: TransactionType!
    amount: Float!
    description: String!
    category: String!
    subcategory: String
    date: AWSDate!
    userId: String! @index(name: "byUser")
    paymentMethod: PaymentMethod
    reference: String
    tags: [String]
    attachments: [String]
    createdAt: AWSDateTime!
    updatedAt: AWSDateTime!
  }

  type Category @model @auth(rules: [{ allow: owner }]) {
    id: ID!
    name: String!
    type: TransactionType!
    subcategories: [String]!
    userId: String! @index(name: "byUser")
    color: String!
    icon: String
    isDefault: Boolean!
    createdAt: AWSDateTime!
    updatedAt: AWSDateTime!
  }

  type Budget @model @auth(rules: [{ allow: owner }]) {
    id: ID!
    userId: String! @index(name: "byUser")
    name: String!
    category: String!
    amount: Float!
    period: BudgetPeriod!
    startDate: AWSDate!
    endDate: AWSDate!
    spent: Float!
    isActive: Boolean!
    createdAt: AWSDateTime!
    updatedAt: AWSDateTime!
  }

  enum TransactionType {
    income
    expense
  }

  enum PaymentMethod {
    cash
    card
    transfer
    check
    other
  }

  enum BudgetPeriod {
    weekly
    monthly
    yearly
  }

  type Query {
    getTransactionsByUser(userId: String!): [Transaction]
    getCategoriesByUser(userId: String!): [Category]
    getBudgetsByUser(userId: String!): [Budget]
    getDashboardData(userId: String!, startDate: AWSDate, endDate: AWSDate): DashboardData
  }

  type DashboardData {
    totalIncome: Float!
    totalExpenses: Float!
    balance: Float!
    monthlyData: [MonthlyData]!
    categoryBreakdown: [CategoryBreakdown]!
    recentTransactions: [Transaction]!
  }

  type MonthlyData {
    month: String!
    income: Float!
    expenses: Float!
    balance: Float!
    transactionCount: Int!
  }

  type CategoryBreakdown {
    category: String!
    amount: Float!
    percentage: Float!
    color: String!
    transactionCount: Int!
  }
`;

export default typeDefs;