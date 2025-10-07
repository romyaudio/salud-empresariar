#!/usr/bin/env node

/**
 * Script para configurar amplify_outputs.json desde el archivo de ejemplo
 * Este script debe ejecutarse después de configurar AWS Amplify
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Configuración de amplify_outputs.json\n');

// Verificar si ya existe el archivo
const outputPath = path.join(process.cwd(), 'amplify_outputs.json');
const examplePath = path.join(process.cwd(), 'amplify_outputs.example.json');

if (fs.existsSync(outputPath)) {
  console.log('⚠️  amplify_outputs.json ya existe.');
  rl.question('¿Deseas sobrescribirlo? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupFile();
    } else {
      console.log('❌ Operación cancelada.');
      rl.close();
    }
  });
} else {
  setupFile();
}

function setupFile() {
  console.log('\n📋 Necesitas proporcionar la siguiente información de AWS Amplify:');
  console.log('   (Puedes encontrarla en la consola de AWS o ejecutando: npx amplify status)\n');

  const config = {};

  rl.question('🔐 User Pool ID (ej: us-east-1_XXXXXXXXX): ', (userPoolId) => {
    config.userPoolId = userPoolId;
    
    rl.question('📱 User Pool Client ID (ej: xxxxxxxxxxxxxxxxxxxxxxxxxx): ', (clientId) => {
      config.clientId = clientId;
      
      rl.question('🌐 GraphQL Endpoint (ej: https://xxx.appsync-api.us-east-1.amazonaws.com/graphql): ', (endpoint) => {
        config.endpoint = endpoint;
        
        rl.question('📍 AWS Region (default: us-east-1): ', (region) => {
          config.region = region || 'us-east-1';
          
          rl.question('🆔 Identity Pool ID (opcional): ', (identityPoolId) => {
            config.identityPoolId = identityPoolId || `${config.region}:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`;
            
            createConfigFile(config);
            rl.close();
          });
        });
      });
    });
  });
}

function createConfigFile(config) {
  try {
    // Leer el archivo de ejemplo
    const exampleContent = fs.readFileSync(examplePath, 'utf8');
    let configContent = exampleContent;
    
    // Reemplazar los valores de ejemplo con los reales
    configContent = configContent.replace('us-east-1_XXXXXXXXX', config.userPoolId);
    configContent = configContent.replace('xxxxxxxxxxxxxxxxxxxxxxxxxx', config.clientId);
    configContent = configContent.replace('https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql', config.endpoint);
    configContent = configContent.replace(/us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/g, config.identityPoolId);
    
    // Si la región no es us-east-1, reemplazar todas las ocurrencias
    if (config.region !== 'us-east-1') {
      configContent = configContent.replace(/us-east-1/g, config.region);
    }
    
    // Escribir el archivo
    fs.writeFileSync(outputPath, configContent);
    
    console.log('\n✅ amplify_outputs.json creado exitosamente!');
    console.log('\n📋 Configuración aplicada:');
    console.log(`   🔐 User Pool ID: ${config.userPoolId}`);
    console.log(`   📱 Client ID: ${config.clientId}`);
    console.log(`   🌐 GraphQL Endpoint: ${config.endpoint}`);
    console.log(`   📍 Región: ${config.region}`);
    
    console.log('\n🎯 Próximos pasos:');
    console.log('   1. Ejecutar: npm run dev');
    console.log('   2. Probar la autenticación en la aplicación');
    console.log('   3. Verificar conectividad: npm run verify:cognito');
    
    console.log('\n⚠️  IMPORTANTE: Este archivo contiene información sensible.');
    console.log('   - NO lo subas a Git (ya está en .gitignore)');
    console.log('   - Manténlo seguro en tu entorno local');
    
  } catch (error) {
    console.error('\n❌ Error creando el archivo:', error.message);
    console.log('\n💡 Solución manual:');
    console.log('   1. Copia amplify_outputs.example.json a amplify_outputs.json');
    console.log('   2. Reemplaza los valores XXXXXXXXX con tus datos reales de AWS');
  }
}