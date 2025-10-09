#!/usr/bin/env node

/**
 * Script para probar la conexión directa con la base de datos AWS
 * Este script diagnostica problemas de autenticación y conexión GraphQL
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

// Query GraphQL para listar transacciones
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

async function testDatabaseConnection() {
  try {
    console.log('🔧 Configurando Amplify...');
    Amplify.configure(amplifyConfig);
    
    console.log('🔍 Verificando usuario actual...');
    let currentUser;
    try {
      currentUser = await getCurrentUser();
      console.log('✅ Usuario ya autenticado:', currentUser.userId);
    } catch (error) {
      console.log('❌ No hay usuario autenticado:', error.message);
      console.log('ℹ️ Necesitas autenticarte primero en la aplicación web');
      return;
    }

    console.log('🔍 Creando cliente GraphQL...');
    const client = generateClient();

    console.log('🔍 Probando consulta GraphQL...');
    const response = await client.graphql({
      query: LIST_TRANSACTIONS,
    });

    console.log('✅ Conexión exitosa!');
    console.log('📊 Datos recibidos:', JSON.stringify(response.data, null, 2));
    
    if (response.data.listTransactions.items.length === 0) {
      console.log('ℹ️ No hay transacciones en la base de datos');
    } else {
      console.log(`✅ Se encontraron ${response.data.listTransactions.items.length} transacciones`);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error);
    
    if (error.message.includes('No federated jwt')) {
      console.log('🔧 Solución: El usuario no está autenticado correctamente');
      console.log('   1. Asegúrate de estar logueado en la aplicación web');
      console.log('   2. Verifica que las credenciales de Cognito sean correctas');
    } else if (error.message.includes('Network Error')) {
      console.log('🔧 Solución: Problema de red o endpoint incorrecto');
      console.log('   1. Verifica que el endpoint GraphQL sea correcto');
      console.log('   2. Verifica tu conexión a internet');
    } else if (error.message.includes('Unauthorized')) {
      console.log('🔧 Solución: Problema de autorización');
      console.log('   1. Verifica que el usuario tenga permisos');
      console.log('   2. Verifica la configuración de auth en el schema');
    }
  }
}

// Ejecutar el test
testDatabaseConnection();