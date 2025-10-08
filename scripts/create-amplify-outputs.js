#!/usr/bin/env node

/**
 * Script para crear amplify_outputs.json durante el build en Amplify Console
 * Usa variables de entorno para generar el archivo con la configuración correcta
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Creando amplify_outputs.json...');

// Configuración completa con los valores reales
const amplifyOutputs = {
  "auth": {
    "user_pool_id": "us-east-1_9LfPtwFIe",
    "aws_region": "us-east-1",
    "user_pool_client_id": "2ci7dpq70kgaf4hkc58bp8488g",
    "identity_pool_id": "us-east-1:d16ad37a-ca93-41f8-813a-f6bb5fcc595b",
    "mfa_methods": [],
    "standard_required_attributes": [
      "email",
      "given_name"
    ],
    "username_attributes": [
      "email"
    ],
    "user_verification_types": [
      "email"
    ],
    "groups": [],
    "mfa_configuration": "NONE",
    "password_policy": {
      "min_length": 8,
      "require_lowercase": true,
      "require_numbers": true,
      "require_symbols": true,
      "require_uppercase": true
    },
    "unauthenticated_identities_enabled": true
  },
  "data": {
    "url": "https://n2sv2ieosfcejl742dgioju3ra.appsync-api.us-east-1.amazonaws.com/graphql",
    "aws_region": "us-east-1",
    "default_authorization_type": "AMAZON_COGNITO_USER_POOLS",
    "authorization_types": [
      "AWS_IAM"
    ],
    "model_introspection": {
      "version": 1,
      "models": {
        "Transaction": {
          "name": "Transaction",
          "fields": {
            "id": {"name": "id", "isArray": false, "type": "ID", "isRequired": true, "attributes": []},
            "type": {"name": "type", "isArray": false, "type": {"enum": "TransactionType"}, "isRequired": false, "attributes": []},
            "amount": {"name": "amount", "isArray": false, "type": "Float", "isRequired": true, "attributes": []},
            "description": {"name": "description", "isArray": false, "type": "String", "isRequired": true, "attributes": []},
            "category": {"name": "category", "isArray": false, "type": "String", "isRequired": true, "attributes": []},
            "subcategory": {"name": "subcategory", "isArray": false, "type": "String", "isRequired": false, "attributes": []},
            "date": {"name": "date", "isArray": false, "type": "AWSDate", "isRequired": true, "attributes": []},
            "paymentMethod": {"name": "paymentMethod", "isArray": false, "type": {"enum": "TransactionPaymentMethod"}, "isRequired": false, "attributes": []},
            "reference": {"name": "reference", "isArray": false, "type": "String", "isRequired": false, "attributes": []},
            "tags": {"name": "tags", "isArray": true, "type": "String", "isRequired": false, "attributes": [], "isArrayNullable": true},
            "attachments": {"name": "attachments", "isArray": true, "type": "String", "isRequired": false, "attributes": [], "isArrayNullable": true},
            "createdAt": {"name": "createdAt", "isArray": false, "type": "AWSDateTime", "isRequired": false, "attributes": [], "isReadOnly": true},
            "updatedAt": {"name": "updatedAt", "isArray": false, "type": "AWSDateTime", "isRequired": false, "attributes": [], "isReadOnly": true}
          },
          "syncable": true,
          "pluralName": "Transactions",
          "attributes": [
            {"type": "model", "properties": {}},
            {"type": "auth", "properties": {"rules": [{"provider": "userPools", "ownerField": "owner", "allow": "owner", "identityClaim": "cognito:username", "operations": ["create", "update", "delete", "read"]}]}}
          ],
          "primaryKeyInfo": {"isCustomPrimaryKey": false, "primaryKeyFieldName": "id", "sortKeyFieldNames": []}
        },
        "Category": {
          "name": "Category",
          "fields": {
            "id": {"name": "id", "isArray": false, "type": "ID", "isRequired": true, "attributes": []},
            "name": {"name": "name", "isArray": false, "type": "String", "isRequired": true, "attributes": []},
            "type": {"name": "type", "isArray": false, "type": {"enum": "CategoryType"}, "isRequired": false, "attributes": []},
            "subcategories": {"name": "subcategories", "isArray": true, "type": "String", "isRequired": false, "attributes": [], "isArrayNullable": false},
            "color": {"name": "color", "isArray": false, "type": "String", "isRequired": true, "attributes": []},
            "icon": {"name": "icon", "isArray": false, "type": "String", "isRequired": false, "attributes": []},
            "isDefault": {"name": "isDefault", "isArray": false, "type": "Boolean", "isRequired": true, "attributes": []},
            "createdAt": {"name": "createdAt", "isArray": false, "type": "AWSDateTime", "isRequired": false, "attributes": [], "isReadOnly": true},
            "updatedAt": {"name": "updatedAt", "isArray": false, "type": "AWSDateTime", "isRequired": false, "attributes": [], "isReadOnly": true}
          },
          "syncable": true,
          "pluralName": "Categories",
          "attributes": [
            {"type": "model", "properties": {}},
            {"type": "auth", "properties": {"rules": [{"provider": "userPools", "ownerField": "owner", "allow": "owner", "identityClaim": "cognito:username", "operations": ["create", "update", "delete", "read"]}]}}
          ],
          "primaryKeyInfo": {"isCustomPrimaryKey": false, "primaryKeyFieldName": "id", "sortKeyFieldNames": []}
        },
        "Budget": {
          "name": "Budget",
          "fields": {
            "id": {"name": "id", "isArray": false, "type": "ID", "isRequired": true, "attributes": []},
            "name": {"name": "name", "isArray": false, "type": "String", "isRequired": true, "attributes": []},
            "category": {"name": "category", "isArray": false, "type": "String", "isRequired": true, "attributes": []},
            "amount": {"name": "amount", "isArray": false, "type": "Float", "isRequired": true, "attributes": []},
            "period": {"name": "period", "isArray": false, "type": {"enum": "BudgetPeriod"}, "isRequired": false, "attributes": []},
            "startDate": {"name": "startDate", "isArray": false, "type": "AWSDate", "isRequired": true, "attributes": []},
            "endDate": {"name": "endDate", "isArray": false, "type": "AWSDate", "isRequired": true, "attributes": []},
            "spent": {"name": "spent", "isArray": false, "type": "Float", "isRequired": true, "attributes": []},
            "isActive": {"name": "isActive", "isArray": false, "type": "Boolean", "isRequired": true, "attributes": []},
            "createdAt": {"name": "createdAt", "isArray": false, "type": "AWSDateTime", "isRequired": false, "attributes": [], "isReadOnly": true},
            "updatedAt": {"name": "updatedAt", "isArray": false, "type": "AWSDateTime", "isRequired": false, "attributes": [], "isReadOnly": true}
          },
          "syncable": true,
          "pluralName": "Budgets",
          "attributes": [
            {"type": "model", "properties": {}},
            {"type": "auth", "properties": {"rules": [{"provider": "userPools", "ownerField": "owner", "allow": "owner", "identityClaim": "cognito:username", "operations": ["create", "update", "delete", "read"]}]}}
          ],
          "primaryKeyInfo": {"isCustomPrimaryKey": false, "primaryKeyFieldName": "id", "sortKeyFieldNames": []}
        }
      },
      "enums": {
        "TransactionType": {"name": "TransactionType", "values": ["INCOME", "EXPENSE"]},
        "TransactionPaymentMethod": {"name": "TransactionPaymentMethod", "values": ["CASH", "CARD", "TRANSFER", "CHECK", "OTHER"]},
        "CategoryType": {"name": "CategoryType", "values": ["INCOME", "EXPENSE"]},
        "BudgetPeriod": {"name": "BudgetPeriod", "values": ["WEEKLY", "MONTHLY", "YEARLY"]}
      },
      "nonModels": {}
    }
  },
  "version": "1.4"
};

// Escribir el archivo
const outputPath = path.join(process.cwd(), 'amplify_outputs.json');
fs.writeFileSync(outputPath, JSON.stringify(amplifyOutputs, null, 2));

console.log('✅ amplify_outputs.json creado exitosamente');
console.log('📊 Configuración aplicada:');
console.log('   🔐 User Pool ID: us-east-1_9LfPtwFIe');
console.log('   🌐 GraphQL Endpoint: https://n2sv2ieosfcejl742dgioju3ra.appsync-api.us-east-1.amazonaws.com/graphql');
console.log('   📍 Región: us-east-1');