#!/usr/bin/env node

/**
 * Script para diagnosticar problemas de autenticación
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnosticando problemas de autenticación...\n');

// Leer amplify_outputs.json
const amplifyOutputsPath = path.join(process.cwd(), 'amplify_outputs.json');
const amplifyOutputs = JSON.parse(fs.readFileSync(amplifyOutputsPath, 'utf8'));

// Leer .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('📋 Configuración de AWS Cognito:');
console.log(`   🔐 User Pool ID: ${amplifyOutputs.auth.user_pool_id}`);
console.log(`   📱 Client ID: ${amplifyOutputs.auth.user_pool_client_id}`);
console.log(`   🌐 Region: ${amplifyOutputs.auth.aws_region}`);

console.log('\n🔧 Variables de entorno (.env.local):');
const envLines = envContent.split('\n');
envLines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_')) {
    console.log(`   ${line}`);
  }
});

console.log('\n🎭 Estado del modo demo:');
const demoMode = envContent.includes('NEXT_PUBLIC_DEMO_MODE=true');
console.log(`   Modo Demo: ${demoMode ? '✅ ACTIVADO' : '❌ DESACTIVADO'}`);

console.log('\n🔍 Verificando configuración de autenticación:');

// Verificar si las variables de entorno coinciden con amplify_outputs.json
const envUserPoolId = envContent.match(/NEXT_PUBLIC_USER_POOL_ID=(.+)/)?.[1];
const envClientId = envContent.match(/NEXT_PUBLIC_USER_POOL_CLIENT_ID=(.+)/)?.[1];

console.log(`   ENV User Pool ID: ${envUserPoolId}`);
console.log(`   Amplify User Pool ID: ${amplifyOutputs.auth.user_pool_id}`);
console.log(`   ¿Coinciden?: ${envUserPoolId === amplifyOutputs.auth.user_pool_id ? '✅' : '❌'}`);

console.log(`   ENV Client ID: ${envClientId}`);
console.log(`   Amplify Client ID: ${amplifyOutputs.auth.user_pool_client_id}`);
console.log(`   ¿Coinciden?: ${envClientId === amplifyOutputs.auth.user_pool_client_id ? '✅' : '❌'}`);

console.log('\n🚨 Problemas detectados:');

if (demoMode) {
  console.log('   ❌ El modo demo está activado, pero debería estar desactivado');
}

if (envUserPoolId !== amplifyOutputs.auth.user_pool_id) {
  console.log('   ❌ Las variables de entorno no coinciden con amplify_outputs.json');
}

console.log('\n💡 Soluciones recomendadas:');
console.log('   1. Usar amplify_outputs.json directamente (recomendado)');
console.log('   2. Actualizar las variables de entorno para que coincidan');
console.log('   3. Verificar que Amplify esté configurado correctamente');

console.log('\n✅ Diagnóstico completado');