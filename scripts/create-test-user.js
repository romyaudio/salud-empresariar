#!/usr/bin/env node

/**
 * Script para crear un usuario de prueba en AWS Cognito
 * Nota: Este script requiere AWS CLI configurado
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('👤 Creando usuario de prueba en AWS Cognito...\n');

// Leer configuración
const amplifyOutputsPath = path.join(process.cwd(), 'amplify_outputs.json');
const amplifyOutputs = JSON.parse(fs.readFileSync(amplifyOutputsPath, 'utf8'));

const userPoolId = amplifyOutputs.auth.user_pool_id;
const region = amplifyOutputs.auth.aws_region;

console.log(`🔐 User Pool ID: ${userPoolId}`);
console.log(`📍 Región: ${region}\n`);

// Datos del usuario de prueba
const testUser = {
  email: 'test@empresa.com',
  password: 'TempPass123!',
  name: 'Usuario Prueba'
};

try {
  console.log('1️⃣ Creando usuario...');
  
  // Crear usuario
  const createUserCommand = `aws cognito-idp admin-create-user --user-pool-id ${userPoolId} --username ${testUser.email} --user-attributes Name=email,Value=${testUser.email} Name=given_name,Value="${testUser.name}" Name=email_verified,Value=true --temporary-password ${testUser.password} --message-action SUPPRESS --region ${region}`;
  
  execSync(createUserCommand, { stdio: 'inherit' });
  
  console.log('\n2️⃣ Estableciendo contraseña permanente...');
  
  // Establecer contraseña permanente
  const setPasswordCommand = `aws cognito-idp admin-set-user-password --user-pool-id ${userPoolId} --username ${testUser.email} --password ${testUser.password} --permanent --region ${region}`;
  
  execSync(setPasswordCommand, { stdio: 'inherit' });
  
  console.log('\n✅ Usuario de prueba creado exitosamente!');
  console.log('\n📋 Credenciales de prueba:');
  console.log(`   📧 Email: ${testUser.email}`);
  console.log(`   🔑 Contraseña: ${testUser.password}`);
  console.log('\n🎯 Ahora puedes usar estas credenciales para iniciar sesión en la aplicación.');
  
} catch (error) {
  console.error('\n❌ Error creando usuario:', error.message);
  
  if (error.message.includes('UsernameExistsException')) {
    console.log('\n💡 El usuario ya existe. Puedes usar las credenciales:');
    console.log(`   📧 Email: ${testUser.email}`);
    console.log(`   🔑 Contraseña: ${testUser.password}`);
    console.log('\n   Si no recuerdas la contraseña, puedes restablecerla desde la aplicación.');
  } else if (error.message.includes('aws: command not found')) {
    console.log('\n💡 AWS CLI no está instalado. Alternativas:');
    console.log('   1. Instalar AWS CLI: https://aws.amazon.com/cli/');
    console.log('   2. Crear usuario manualmente en AWS Console');
    console.log('   3. Usar el formulario de registro en la aplicación');
  } else {
    console.log('\n💡 Soluciones alternativas:');
    console.log('   1. Verificar que AWS CLI esté configurado correctamente');
    console.log('   2. Crear usuario manualmente en AWS Console');
    console.log('   3. Usar el formulario de registro en la aplicación');
  }
}