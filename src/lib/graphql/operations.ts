// GraphQL Operations for Budget Tracker

// Transaction Mutations
export const CREATE_TRANSACTION = `
  mutation CreateTransaction(
    $type: TransactionType!
    $amount: Float!
    $description: String!
    $category: String!
    $subcategory: String
    $date: AWSDate!
    $paymentMethod: PaymentMethod
    $reference: String
    $tags: [String]
  ) {
    createTransaction(input: {
      type: $type
      amount: $amount
      description: $description
      category: $category
      subcategory: $subcategory
      date: $date
      paymentMethod: $paymentMethod
      reference: $reference
      tags: $tags
    }) {
      id
      type
      amount
      description
      category
      subcategory
      date
      owner
      paymentMethod
      reference
      tags
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TRANSACTION = `
  mutation UpdateTransaction(
    $id: ID!
    $type: TransactionType
    $amount: Float
    $description: String
    $category: String
    $subcategory: String
    $date: AWSDate
    $paymentMethod: PaymentMethod
    $reference: String
    $tags: [String]
  ) {
    updateTransaction(input: {
      id: $id
      type: $type
      amount: $amount
      description: $description
      category: $category
      subcategory: $subcategory
      date: $date
      paymentMethod: $paymentMethod
      reference: $reference
      tags: $tags
    }) {
      id
      type
      amount
      description
      category
      subcategory
      date
      owner
      paymentMethod
      reference
      tags
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRANSACTION = `
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(input: { id: $id }) {
      id
    }
  }
`;

// Transaction Queries
export const GET_TRANSACTIONS = `
  query ListTransactions {
    listTransactions {
      items {
        id
        type
        amount
        description
        category
        subcategory
        date
        owner
        paymentMethod
        reference
        tags
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_TRANSACTION = `
  query GetTransaction($id: ID!) {
    getTransaction(id: $id) {
      id
      type
      amount
      description
      category
      subcategory
      date
      owner
      paymentMethod
      reference
      tags
      createdAt
      updatedAt
    }
  }
`;

// Category Mutations
export const CREATE_CATEGORY = `
  mutation CreateCategory(
    $name: String!
    $type: TransactionType!
    $subcategories: [String]!
    $color: String!
    $icon: String
    $isDefault: Boolean!
  ) {
    createCategory(input: {
      name: $name
      type: $type
      subcategories: $subcategories
      color: $color
      icon: $icon
      isDefault: $isDefault
    }) {
      id
      name
      type
      subcategories
      owner
      color
      icon
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATEGORY = `
  mutation UpdateCategory(
    $id: ID!
    $name: String
    $subcategories: [String]
    $color: String
    $icon: String
  ) {
    updateCategory(input: {
      id: $id
      name: $name
      subcategories: $subcategories
      color: $color
      icon: $icon
    }) {
      id
      name
      type
      subcategories
      owner
      color
      icon
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CATEGORY = `
  mutation DeleteCategory($id: ID!) {
    deleteCategory(input: { id: $id }) {
      id
    }
  }
`;

// Category Queries
export const GET_CATEGORIES = `
  query ListCategories {
    listCategories {
      items {
        id
        name
        type
        subcategories
        owner
        color
        icon
        isDefault
        createdAt
        updatedAt
      }
    }
  }
`;

// Dashboard Query
export const GET_DASHBOARD_DATA = `
  query GetDashboardData($userId: String!, $startDate: AWSDate, $endDate: AWSDate) {
    getDashboardData(userId: $userId, startDate: $startDate, endDate: $endDate) {
      totalIncome
      totalExpenses
      balance
      monthlyData {
        month
        income
        expenses
        balance
        transactionCount
      }
      categoryBreakdown {
        category
        amount
        percentage
        color
        transactionCount
      }
      recentTransactions {
        id
        type
        amount
        description
        category
        date
        createdAt
      }
    }
  }
`;

// Budget Mutations
export const CREATE_BUDGET = `
  mutation CreateBudget(
    $name: String!
    $category: String!
    $amount: Float!
    $period: BudgetPeriod!
    $startDate: AWSDate!
    $endDate: AWSDate!
  ) {
    createBudget(input: {
      name: $name
      category: $category
      amount: $amount
      period: $period
      startDate: $startDate
      endDate: $endDate
      spent: 0
      isActive: true
    }) {
      id
      name
      category
      amount
      period
      startDate
      endDate
      spent
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_BUDGETS = `
  query GetBudgets($userId: String!) {
    getBudgetsByUser(userId: $userId) {
      id
      name
      category
      amount
      period
      startDate
      endDate
      spent
      isActive
      createdAt
      updatedAt
    }
  }
`;

// User Profile Mutations
export const CREATE_USER_PROFILE = `
  mutation CreateUserProfile(
    $firstName: String!
    $lastName: String!
    $phone: String
    $position: String
    $profileImage: String
    $bio: String
    $preferences: UserPreferencesInput
  ) {
    createUserProfile(input: {
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      position: $position
      profileImage: $profileImage
      bio: $bio
      preferences: $preferences
    }) {
      id
      firstName
      lastName
      phone
      position
      profileImage
      bio
      preferences {
        currency
        dateFormat
        language
        timezone
        defaultCategories
        notifications {
          emailNotifications
          pushNotifications
          budgetAlerts
          weeklyReports
          monthlyReports
        }
      }
      createdAt
      updatedAt
      owner
    }
  }
`;

export const UPDATE_USER_PROFILE = `
  mutation UpdateUserProfile(
    $id: ID!
    $firstName: String
    $lastName: String
    $phone: String
    $position: String
    $profileImage: String
    $bio: String
    $preferences: UserPreferencesInput
  ) {
    updateUserProfile(input: {
      id: $id
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      position: $position
      profileImage: $profileImage
      bio: $bio
      preferences: $preferences
    }) {
      id
      firstName
      lastName
      phone
      position
      profileImage
      bio
      preferences {
        currency
        dateFormat
        language
        timezone
        defaultCategories
        notifications {
          emailNotifications
          pushNotifications
          budgetAlerts
          weeklyReports
          monthlyReports
        }
      }
      createdAt
      updatedAt
      owner
    }
  }
`;

export const GET_USER_PROFILE = `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      id
      firstName
      lastName
      phone
      position
      profileImage
      bio
      preferences {
        currency
        dateFormat
        language
        timezone
        defaultCategories
        notifications {
          emailNotifications
          pushNotifications
          budgetAlerts
          weeklyReports
          monthlyReports
        }
      }
      company {
        id
        companyName
        taxId
        address
        city
        country
        phone
        email
        website
        logo
        description
        industry
        foundedYear
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      owner
    }
  }
`;

// Company Profile Mutations
export const CREATE_COMPANY_PROFILE = `
  mutation CreateCompanyProfile(
    $companyName: String!
    $taxId: String
    $address: String
    $city: String
    $country: String
    $phone: String
    $email: AWSEmail
    $website: AWSURL
    $logo: String
    $description: String
    $industry: String
    $foundedYear: Int
    $userProfileId: ID!
  ) {
    createCompanyProfile(input: {
      companyName: $companyName
      taxId: $taxId
      address: $address
      city: $city
      country: $country
      phone: $phone
      email: $email
      website: $website
      logo: $logo
      description: $description
      industry: $industry
      foundedYear: $foundedYear
      userProfileCompanyId: $userProfileId
    }) {
      id
      companyName
      taxId
      address
      city
      country
      phone
      email
      website
      logo
      description
      industry
      foundedYear
      createdAt
      updatedAt
      owner
    }
  }
`;

export const UPDATE_COMPANY_PROFILE = `
  mutation UpdateCompanyProfile(
    $id: ID!
    $companyName: String
    $taxId: String
    $address: String
    $city: String
    $country: String
    $phone: String
    $email: AWSEmail
    $website: AWSURL
    $logo: String
    $description: String
    $industry: String
    $foundedYear: Int
  ) {
    updateCompanyProfile(input: {
      id: $id
      companyName: $companyName
      taxId: $taxId
      address: $address
      city: $city
      country: $country
      phone: $phone
      email: $email
      website: $website
      logo: $logo
      description: $description
      industry: $industry
      foundedYear: $foundedYear
    }) {
      id
      companyName
      taxId
      address
      city
      country
      phone
      email
      website
      logo
      description
      industry
      foundedYear
      createdAt
      updatedAt
      owner
    }
  }
`;