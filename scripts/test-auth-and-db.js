#!/usr/bin/env node

/**
 * Script para probar autenticación y conexión con la base de datos
 * Este script ayuda a diagnosticar problemas de autenticación
 */

const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');
const { signIn, getCurrentUser, signOut } = require('aws-amplify/auth');

// Configuración de Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_9LfPtwFIe',
      userPoolClientId: '2ci7dpq70kgaf4hkc58bp8488g',
      identityPoolId: 'us-east-1:d16ad37a-ca93-41f8-813a-f6bb5fcc595b',
    }
  },
  API: {
    GraphQL: {
      endpoint: 'https://n2sv2ieosfcejl742dgioju3ra.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'userPool'
    }
  }
};

// Query GraphQL para crear una transacción de prueba
const CREATE_TRANSACTION = `
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      type
      amount
      description
      category
      date
      owner
      createdAt
      updatedAt
    }
  }
`;

const LIST_TRANSACTIONS = `
  query ListTransactions {
    listTransactions {
      items {
        id
        type
        amount
        description
        category
        date
        owner
        createdAt
        updatedAt
      }
    }
  }
`;

async function testAuthAndDatabase() {
  try {
    console.log('🔧 Configurando Amplify...');
    Amplify.configure(amplifyConfig);
    
    console.log('🔍 Verificando usuario actual...');
    let currentUser;
    try {
      currentUser = await getCurrentUser();
      console.log('✅ Usuario autenticado:', currentUser.userId);
      console.log('📧 Email:', currentUser.signInDetails?.loginId);
    } catch (error) {
      console.log('❌ No hay usuario autenticado');
      console.log('ℹ️ Para probar la conexión, necesitas:');
      console.log('   1. Ir a la aplicación web');
      console.log('   2. Registrarte o iniciar sesión');
      console.log('   3. Volver a ejecutar este script');
      return;
    }

    console.log('🔍 Creando cliente GraphQL...');
    const client = generateClient();

    console.log('🔍 Probando consulta GraphQL (listar transacciones)...');
    const listResponse = await client.graphql({
      query: LIST_TRANSACTIONS,
    });

    console.log('✅ Consulta exitosa!');
    console.log('📊 Transacciones encontradas:', listResponse.data.listTransactions.items.length);
    
    if (listResponse.data.listTransactions.items.length > 0) {
      console.log('📋 Primera transacción:', JSON.stringify(listResponse.data.listTransactions.items[0], null, 2));
    }

    console.log('🔍 Probando crear una transacción de prueba...');
    const testTransaction = {
      type: 'EXPENSE',
      amount: 10.50,
      description: 'Transacción de prueba desde script',
      category: 'Pruebas',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH'
    };

    const createResponse = await client.graphql({
      query: CREATE_TRANSACTION,
      variables: { input: testTransaction }
    });

    console.log('✅ Transacción creada exitosamente!');
    console.log('📋 Nueva transacción:', JSON.stringify(createResponse.data.createTransaction, null, 2));

    console.log('🎉 ¡Conexión con la base de datos funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error.message.includes('No federated jwt')) {
      console.log('🔧 Problema: Token de autenticación no válido');
      console.log('   Solución: Cierra sesión y vuelve a iniciar sesión en la app');
    } else if (error.message.includes('Network Error')) {
      console.log('🔧 Problema: Error de red');
      console.log('   Solución: Verifica tu conexión a internet y el endpoint GraphQL');
    } else if (error.message.includes('Unauthorized')) {
      console.log('🔧 Problema: No autorizado');
      console.log('   Solución: Verifica los permisos del usuario en el schema GraphQL');
    } else if (error.message.includes('ValidationException')) {
      console.log('🔧 Problema: Error de validación');
      console.log('   Solución: Verifica que los datos enviados cumplan con el schema');
    }
  }
}

// Ejecutar el test
testAuthAndDatabase();