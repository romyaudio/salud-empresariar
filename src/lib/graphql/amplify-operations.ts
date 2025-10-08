// Operaciones GraphQL generadas automáticamente por Amplify
// Estas deberían coincidir exactamente con el esquema desplegado

export const CREATE_TRANSACTION_AMPLIFY = `
  mutation CreateTransaction(
    $input: CreateTransactionInput!
  ) {
    createTransaction(input: $input) {
      id
      type
      amount
      description
      category
      subcategory
      date
      paymentMethod
      reference
      tags
      owner
      createdAt
      updatedAt
    }
  }
`;

export const LIST_TRANSACTIONS_AMPLIFY = `
  query ListTransactions(
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        amount
        description
        category
        subcategory
        date
        paymentMethod
        reference
        tags
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const GET_TRANSACTION_AMPLIFY = `
  query GetTransaction($id: ID!) {
    getTransaction(id: $id) {
      id
      type
      amount
      description
      category
      subcategory
      date
      paymentMethod
      reference
      tags
      owner
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TRANSACTION_AMPLIFY = `
  mutation UpdateTransaction(
    $input: UpdateTransactionInput!
  ) {
    updateTransaction(input: $input) {
      id
      type
      amount
      description
      category
      subcategory
      date
      paymentMethod
      reference
      tags
      owner
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TRANSACTION_AMPLIFY = `
  mutation DeleteTransaction(
    $input: DeleteTransactionInput!
  ) {
    deleteTransaction(input: $input) {
      id
    }
  }
`;