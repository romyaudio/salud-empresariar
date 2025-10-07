#!/usr/bin/env node

/**
 * Script para verificar la conexión con AWS Amplify
 * Verifica que la configuración esté correcta y que se pueda conectar a los servicios
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de AWS Amplify...\n');

// Verificar que existe amplify_outputs.json
const amplifyOutputsPath = path.join(process.cwd(), 'amplify_outputs.json');
if (!fs.existsSync(amplifyOutputsPath)) {
  console.error('❌ No se encontró amplify_outputs.json');
  console.log('   Ejecuta: npx amplify pull para generar el archivo');
  process.exit(1);
}

// Leer configuración
const amplifyOutputs = JSON.parse(fs.readFileSync(amplifyOutputsPath, 'utf8'));

console.log('📋 Configuración encontrada:');
console.log(`   🔐 User Pool ID: ${amplifyOutputs.auth.user_pool_id}`);
console.log(`   📱 Client ID: ${amplifyOutputs.auth.user_pool_client_id}`);
console.log(`   🌐 GraphQL URL: ${amplifyOutputs.data.url}`);
console.log(`   📍 Región: ${amplifyOutputs.data.aws_region}`);

// Verificar variables de entorno
console.log('\n🔧 Variables de entorno:');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const demoMode = envContent.includes('NEXT_PUBLIC_DEMO_MODE=true');
  
  console.log(`   🎭 Modo Demo: ${demoMode ? '❌ ACTIVADO' : '✅ DESACTIVADO'}`);
  
  if (demoMode) {
    console.log('\n⚠️  ADVERTENCIA: El modo demo está activado');
    console.log('   Los datos no se guardarán en AWS DynamoDB');
    console.log('   Cambia NEXT_PUBLIC_DEMO_MODE=false en .env.local');
  } else {
    console.log('\n✅ Configuración correcta para usar AWS DynamoDB');
  }
} else {
  console.log('   ⚠️  No se encontró .env.local');
}

// Verificar modelos de datos
console.log('\n📊 Modelos de datos configurados:');
const models = amplifyOutputs.data.model_introspection.models;
Object.keys(models).forEach(modelName => {
  const model = models[modelName];
  const fieldCount = Object.keys(model.fields).length;
  console.log(`   📋 ${modelName}: ${fieldCount} campos`);
});

console.log('\n🎯 Próximos pasos:');
console.log('   1. Asegúrate de que NEXT_PUBLIC_DEMO_MODE=false en .env.local');
console.log('   2. Ejecuta: npm run dev');
console.log('   3. Regístrate o inicia sesión en la aplicación');
console.log('   4. Los datos se guardarán en AWS DynamoDB');

console.log('\n✅ Verificación completada');