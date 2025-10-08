#!/usr/bin/env node

/**
 * Script para probar GraphQL directamente con AWS AppSync
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno desde .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!key.startsWith('#') && value) {
          process.env[key.trim()] = value;
        }
      }
    });
  }
}

loadEnvFile();

console.log('🔍 Probando conexión GraphQL directa...\n');

// Configuración desde variables de entorno
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;

console.log('📋 Configuración:');
console.log('- GraphQL Endpoint:', GRAPHQL_ENDPOINT);
console.log('- AWS Region:', AWS_REGION);
console.log('- Demo Mode:', process.env.NEXT_PUBLIC_DEMO_MODE);

if (!GRAPHQL_ENDPOINT) {
  console.error('❌ NEXT_PUBLIC_GRAPHQL_ENDPOINT no está configurado');
  process.exit(1);
}

// Query simple para probar conectividad
const testQuery = {
  query: `
    query ListTransactions {
      listTransactions {
        items {
          id
          type
          amount
          description
          category
          createdAt
        }
      }
    }
  `
};

// Función para hacer request HTTP
function makeGraphQLRequest(query) {
  return new Promise((resolve, reject) => {
    const url = new URL(GRAPHQL_ENDPOINT);
    const postData = JSON.stringify(query);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-api-key': 'da2-fakeApiId123456', // Placeholder - necesitaríamos la real
      }
    };

    console.log('🌐 Haciendo request a:', url.href);
    console.log('📤 Query:', JSON.stringify(query, null, 2));

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log('📥 Status Code:', res.statusCode);
      console.log('📥 Headers:', res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: data, parseError: error });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Función principal
async function testGraphQL() {
  try {
    console.log('\n🧪 Probando query básica...');
    
    const result = await makeGraphQLRequest(testQuery);
    
    console.log('\n📊 Resultado:');
    console.log('- Status Code:', result.statusCode);
    
    if (result.parseError) {
      console.log('❌ Error parsing response:', result.parseError.message);
      console.log('📄 Raw response:', result.data);
    } else {
      console.log('📄 Response:', JSON.stringify(result.data, null, 2));
      
      if (result.data.errors) {
        console.log('\n❌ GraphQL Errors encontrados:');
        result.data.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.message}`);
          if (error.extensions) {
            console.log('     Extensions:', JSON.stringify(error.extensions, null, 4));
          }
        });
      }
      
      if (result.data.data) {
        console.log('\n✅ GraphQL Data recibida exitosamente');
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error en la conexión:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('🔍 El endpoint GraphQL no se puede resolver');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔍 Conexión rechazada al endpoint');
    } else {
      console.error('🔍 Error details:', error);
    }
  }
}

// Ejecutar test
testGraphQL().then(() => {
  console.log('\n🏁 Test completado');
}).catch((error) => {
  console.error('\n💥 Test falló:', error);
  process.exit(1);
});