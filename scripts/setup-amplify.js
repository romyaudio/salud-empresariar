#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando AWS Amplify para Budget Tracker...\n');

// Función para ejecutar comandos
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en: ${description}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Función para verificar si Amplify CLI está instalado
function checkAmplifyInstallation() {
  try {
    execSync('amplify --version', { stdio: 'pipe' });
    console.log('✅ Amplify CLI está instalado\n');
  } catch (error) {
    console.log('❌ Amplify CLI no está instalado');
    console.log('📋 Instalando Amplify CLI...');
    runCommand('npm install -g @aws-amplify/cli', 'Instalación de Amplify CLI');
  }
}

// Función para verificar configuración de AWS
function checkAWSConfiguration() {
  try {
    execSync('aws --version', { stdio: 'pipe' });
    console.log('✅ AWS CLI está instalado');
  } catch (error) {
    console.log('⚠️  AWS CLI no está instalado. Se necesita para configurar Amplify.');
    console.log('📋 Instala AWS CLI desde: https://aws.amazon.com/cli/');
  }
}

// Función principal
async function setupAmplify() {
  try {
    console.log('🔍 Verificando prerrequisitos...');
    checkAmplifyInstallation();
    checkAWSConfiguration();
    
    console.log('📋 PASOS PARA CONFIGURAR AMPLIFY:');
    console.log('1. Configura AWS CLI con tus credenciales:');
    console.log('   aws configure');
    console.log('');
    console.log('2. Inicializa el proyecto Amplify:');
    console.log('   amplify init');
    console.log('');
    console.log('3. Agrega autenticación:');
    console.log('   amplify add auth');
    console.log('   - Selecciona "Default configuration"');
    console.log('   - Selecciona "Username" como método de login');
    console.log('   - Configura los atributos requeridos');
    console.log('');
    console.log('4. Agrega API GraphQL:');
    console.log('   amplify add api');
    console.log('   - Selecciona "GraphQL"');
    console.log('   - Selecciona "Amazon Cognito User Pool" como autorización');
    console.log('   - Usa el schema existente en amplify/backend/api/budgettracker/schema.graphql');
    console.log('');
    console.log('5. Despliega los recursos:');
    console.log('   amplify push');
    console.log('');
    console.log('6. Actualiza las variables de entorno:');
    console.log('   - Copia los valores de aws-exports.js');
    console.log('   - Actualiza .env.local con las configuraciones');
    console.log('   - Cambia NEXT_PUBLIC_DEMO_MODE=false');
    console.log('');
    
    console.log('📋 CONFIGURACIÓN RECOMENDADA:');
    console.log('');
    console.log('Auth Configuration:');
    console.log('- Authentication flow: Username');
    console.log('- Required attributes: email, name');
    console.log('- MFA: Optional');
    console.log('');
    console.log('API Configuration:');
    console.log('- Authorization: Amazon Cognito User Pool');
    console.log('- Schema: Use existing schema.graphql');
    console.log('- Conflict resolution: Auto Merge');
    console.log('');
    
    console.log('🎯 DESPUÉS DE LA CONFIGURACIÓN:');
    console.log('1. Ejecuta: npm run build (para verificar que todo funciona)');
    console.log('2. Ejecuta: npm run deploy:prepare (para desplegar)');
    console.log('3. La aplicación cambiará automáticamente del modo demo a AWS');
    console.log('');
    
    console.log('✨ ¡Listo para configurar AWS Amplify!');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

// Ejecutar configuración
setupAmplify();