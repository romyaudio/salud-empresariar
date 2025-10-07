#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de AWS Amplify...\n');

// Función para leer variables de entorno
function getEnvVar(name) {
  // Primero intentar desde .env.local
  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const match = envContent.match(new RegExp(`^${name}=(.*)$`, 'm'));
    if (match) {
      return match[1].trim();
    }
  }
  
  // Luego desde process.env
  return process.env[name];
}

// Verificar variables requeridas
const requiredVars = [
  'NEXT_PUBLIC_AWS_REGION',
  'NEXT_PUBLIC_USER_POOL_ID',
  'NEXT_PUBLIC_USER_POOL_CLIENT_ID',
  'NEXT_PUBLIC_GRAPHQL_ENDPOINT',
  'NEXT_PUBLIC_DEMO_MODE'
];

let allConfigured = true;

console.log('📋 Variables de Entorno:');
console.log('========================');

requiredVars.forEach(varName => {
  const value = getEnvVar(varName);
  const status = value ? '✅' : '❌';
  const displayValue = value ? 
    (value.includes('XXXXXXXXX') ? '❌ PLACEHOLDER' : '✅ CONFIGURADO') : 
    '❌ FALTANTE';
  
  console.log(`${status} ${varName}: ${displayValue}`);
  
  if (!value || value.includes('XXXXXXXXX')) {
    allConfigured = false;
  }
});

console.log('\n🔍 Verificación Detallada:');
console.log('==========================');

// Verificar User Pool ID
const userPoolId = getEnvVar('NEXT_PUBLIC_USER_POOL_ID');
if (userPoolId) {
  const userPoolRegex = /^us-east-1_[A-Za-z0-9]{9}$/;
  if (userPoolRegex.test(userPoolId)) {
    console.log('✅ User Pool ID tiene formato correcto');
  } else {
    console.log('❌ User Pool ID tiene formato incorrecto');
    console.log('   Formato esperado: us-east-1_AbC123DeF');
    allConfigured = false;
  }
} else {
  console.log('❌ User Pool ID no configurado');
}

// Verificar Client ID
const clientId = getEnvVar('NEXT_PUBLIC_USER_POOL_CLIENT_ID');
if (clientId) {
  if (clientId.length >= 20 && !clientId.includes('x')) {
    console.log('✅ Client ID tiene formato correcto');
  } else {
    console.log('❌ Client ID tiene formato incorrecto');
    console.log('   Debe ser una cadena alfanumérica de ~26 caracteres');
    allConfigured = false;
  }
} else {
  console.log('❌ Client ID no configurado');
}

// Verificar GraphQL Endpoint
const graphqlEndpoint = getEnvVar('NEXT_PUBLIC_GRAPHQL_ENDPOINT');
if (graphqlEndpoint) {
  const endpointRegex = /^https:\/\/[a-z0-9]{26}\.appsync-api\.us-east-1\.amazonaws\.com\/graphql$/;
  if (endpointRegex.test(graphqlEndpoint)) {
    console.log('✅ GraphQL Endpoint tiene formato correcto');
  } else {
    console.log('❌ GraphQL Endpoint tiene formato incorrecto');
    console.log('   Formato esperado: https://abcdef...xyz.appsync-api.us-east-1.amazonaws.com/graphql');
    allConfigured = false;
  }
} else {
  console.log('❌ GraphQL Endpoint no configurado');
}

// Verificar modo demo
const demoMode = getEnvVar('NEXT_PUBLIC_DEMO_MODE');
if (demoMode === 'false') {
  console.log('✅ Modo demo desactivado (modo producción)');
} else if (demoMode === 'true') {
  console.log('⚠️  Modo demo activado');
  console.log('   Cambia NEXT_PUBLIC_DEMO_MODE=false para usar AWS');
} else {
  console.log('❌ NEXT_PUBLIC_DEMO_MODE no configurado correctamente');
  allConfigured = false;
}

console.log('\n📁 Archivos de Configuración:');
console.log('==============================');

// Verificar archivos
const files = [
  '.env.local',
  '.env.example',
  'amplify.yml',
  'src/lib/amplify.ts'
];

files.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🎯 Resultado Final:');
console.log('===================');

if (allConfigured) {
  console.log('✅ ¡Configuración completa!');
  console.log('');
  console.log('🚀 Próximos pasos:');
  console.log('1. Ejecutar: npm run build');
  console.log('2. Si el build es exitoso, hacer push a GitHub');
  console.log('3. Configurar las mismas variables en Amplify Console');
  console.log('4. Desplegar desde Amplify Console');
} else {
  console.log('❌ Configuración incompleta');
  console.log('');
  console.log('📋 Pasos pendientes:');
  console.log('1. Completar configuración de AWS (ver docs/AWS_AMPLIFY_MANUAL_SETUP.md)');
  console.log('2. Crear archivo .env.local con los valores correctos');
  console.log('3. Verificar que todos los servicios estén creados en AWS');
  console.log('4. Ejecutar este script nuevamente');
}

console.log('\n📚 Documentación:');
console.log('==================');
console.log('- Guía completa: docs/AWS_AMPLIFY_MANUAL_SETUP.md');
console.log('- Valores de configuración: docs/CONFIGURATION_VALUES.md');
console.log('- Integración GraphQL: docs/GRAPHQL_INTEGRATION.md');

process.exit(allConfigured ? 0 : 1);