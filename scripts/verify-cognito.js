#!/usr/bin/env node

/**
 * Script para verificar la conectividad con AWS Cognito
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando conectividad con AWS Cognito...\n');

// Leer configuración
const amplifyOutputsPath = path.join(process.cwd(), 'amplify_outputs.json');
const amplifyOutputs = JSON.parse(fs.readFileSync(amplifyOutputsPath, 'utf8'));

const userPoolId = amplifyOutputs.auth.user_pool_id;
const region = amplifyOutputs.auth.aws_region;

console.log(`🔐 User Pool ID: ${userPoolId}`);
console.log(`📍 Región: ${region}\n`);

try {
  console.log('1️⃣ Verificando AWS CLI...');
  execSync('aws --version', { stdio: 'inherit' });
  
  console.log('\n2️⃣ Verificando credenciales AWS...');
  execSync('aws sts get-caller-identity', { stdio: 'inherit' });
  
  console.log('\n3️⃣ Listando User Pools en la región...');
  execSync(`aws cognito-idp list-user-pools --max-results 10 --region ${region}`, { stdio: 'inherit' });
  
  console.log('\n4️⃣ Intentando describir el User Pool específico...');
  execSync(`aws cognito-idp describe-user-pool --user-pool-id ${userPoolId} --region ${region}`, { stdio: 'inherit' });
  
  console.log('\n✅ Conectividad verificada exitosamente!');
  
} catch (error) {
  console.error('\n❌ Error en la verificación:', error.message);
  
  if (error.message.includes('aws: command not found')) {
    console.log('\n💡 AWS CLI no está instalado.');
    console.log('   Instalar desde: https://aws.amazon.com/cli/');
  } else if (error.message.includes('Unable to locate credentials')) {
    console.log('\n💡 Credenciales AWS no configuradas.');
    console.log('   Ejecutar: aws configure');
  } else if (error.message.includes('ResourceNotFoundException')) {
    console.log('\n💡 El User Pool no existe o no tienes acceso.');
    console.log('   Posibles causas:');
    console.log('   - El User Pool fue eliminado');
    console.log('   - Estás usando credenciales de otra cuenta AWS');
    console.log('   - La región es incorrecta');
  } else {
    console.log('\n💡 Error desconocido. Verifica:');
    console.log('   - Credenciales AWS correctas');
    console.log('   - Permisos de Cognito');
    console.log('   - Conectividad a internet');
  }
}