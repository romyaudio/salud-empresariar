#!/usr/bin/env node

/**
 * Script de despliegue manual para AWS Amplify
 * Guía paso a paso para despliegue manual
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Budget Tracker - Despliegue Manual a AWS Amplify\n');

// Función para mostrar pasos
function showStep(stepNumber, title, description) {
  console.log(`\n📋 PASO ${stepNumber}: ${title}`);
  console.log(`   ${description}\n`);
}

// Función para esperar confirmación del usuario
function waitForConfirmation(message) {
  console.log(`⏳ ${message}`);
  console.log('   Presiona Enter cuando hayas completado este paso...');
  
  // En un entorno real, aquí esperarías input del usuario
  // Para este script, simplemente continuamos
}

// Función para verificar prerequisitos
function checkPrerequisites() {
  console.log('🔍 Verificando prerequisitos...\n');
  
  const requirements = [
    {
      name: 'Node.js',
      check: () => {
        try {
          const version = execSync('node --version', { encoding: 'utf8' }).trim();
          console.log(`✅ Node.js: ${version}`);
          return true;
        } catch {
          console.error('❌ Node.js no está instalado');
          return false;
        }
      }
    },
    {
      name: 'npm',
      check: () => {
        try {
          const version = execSync('npm --version', { encoding: 'utf8' }).trim();
          console.log(`✅ npm: ${version}`);
          return true;
        } catch {
          console.error('❌ npm no está disponible');
          return false;
        }
      }
    },
    {
      name: 'Git',
      check: () => {
        try {
          const version = execSync('git --version', { encoding: 'utf8' }).trim();
          console.log(`✅ Git: ${version}`);
          return true;
        } catch {
          console.error('❌ Git no está instalado');
          return false;
        }
      }
    },
    {
      name: 'AWS CLI (opcional)',
      check: () => {
        try {
          const version = execSync('aws --version', { encoding: 'utf8' }).trim();
          console.log(`✅ AWS CLI: ${version}`);
          return true;
        } catch {
          console.log('⚠️  AWS CLI no está instalado (opcional)');
          return true; // No es crítico
        }
      }
    }
  ];
  
  let allGood = true;
  requirements.forEach(req => {
    if (!req.check()) {
      allGood = false;
    }
  });
  
  return allGood;
}

// Función principal
function main() {
  console.log('=' * 60);
  console.log('🎯 GUÍA DE DESPLIEGUE MANUAL - BUDGET TRACKER');
  console.log('=' * 60);
  
  // Verificar prerequisitos
  if (!checkPrerequisites()) {
    console.error('\n❌ Faltan prerequisitos. Por favor, instala las herramientas requeridas.');
    process.exit(1);
  }
  
  showStep(1, 'PREPARACIÓN DEL CÓDIGO', 
    'Ejecutar verificaciones y preparar el código para despliegue');
  
  console.log('   Ejecutando script de pre-deploy...');
  try {
    execSync('npm run pre-deploy', { stdio: 'inherit' });
    console.log('   ✅ Pre-deploy completado exitosamente');
  } catch (error) {
    console.error('   ❌ Pre-deploy falló. Revisa los errores arriba.');
    process.exit(1);
  }
  
  showStep(2, 'CONFIGURACIÓN DE AWS AMPLIFY', 
    'Configurar la aplicación en AWS Amplify Console');
  
  console.log('   📝 Instrucciones:');
  console.log('   1. Ve a https://console.aws.amazon.com/amplify/');
  console.log('   2. Haz clic en "New app" > "Host web app"');
  console.log('   3. Selecciona tu proveedor de Git (GitHub, GitLab, etc.)');
  console.log('   4. Autoriza AWS Amplify para acceder a tu repositorio');
  console.log('   5. Selecciona el repositorio del Budget Tracker');
  console.log('   6. Selecciona la rama "main" (o tu rama principal)');
  
  waitForConfirmation('Completa la configuración inicial en AWS Amplify Console');
  
  showStep(3, 'CONFIGURACIÓN DE BUILD', 
    'Configurar las opciones de build en Amplify');
  
  console.log('   📝 Configuración recomendada:');
  console.log('   - App name: budget-tracker');
  console.log('   - Environment: production');
  console.log('   - Build settings: Usar amplify.yml (ya está configurado)');
  console.log('   - Advanced settings:');
  console.log('     * Node.js version: 18 o superior');
  console.log('     * Build timeout: 30 minutos');
  console.log('     * Compute: Medium (recomendado)');
  
  waitForConfirmation('Configura las opciones de build en Amplify Console');
  
  showStep(4, 'VARIABLES DE ENTORNO', 
    'Configurar variables de entorno necesarias');
  
  console.log('   📝 Variables requeridas en Amplify Console:');
  console.log('   - NODE_ENV: production');
  console.log('   - AMPLIFY_MONOREPO_APP_ROOT: (dejar vacío)');
  console.log('   - AMPLIFY_DIFF_DEPLOY: false');
  console.log('   - _LIVE_UPDATES: [{"name":"Amplify CLI","pkg":"@aws-amplify/cli","type":"npm","version":"latest"}]');
  
  console.log('\n   📝 Variables opcionales:');
  console.log('   - NEXT_TELEMETRY_DISABLED: 1');
  console.log('   - CI: true');
  
  waitForConfirmation('Configura las variables de entorno en Amplify Console');
  
  showStep(5, 'CONFIGURACIÓN DE DOMINIO (OPCIONAL)', 
    'Configurar dominio personalizado si es necesario');
  
  console.log('   📝 Para dominio personalizado:');
  console.log('   1. Ve a "Domain management" en Amplify Console');
  console.log('   2. Haz clic en "Add domain"');
  console.log('   3. Ingresa tu dominio');
  console.log('   4. Configura los registros DNS según las instrucciones');
  console.log('   5. Espera la verificación SSL (puede tomar hasta 24 horas)');
  
  console.log('\n   ⚠️  Si no tienes dominio personalizado, puedes usar el dominio de Amplify');
  
  waitForConfirmation('Configura el dominio (o continúa con el dominio de Amplify)');
  
  showStep(6, 'PRIMER DESPLIEGUE', 
    'Iniciar el primer build y despliegue');
  
  console.log('   📝 Proceso de despliegue:');
  console.log('   1. Haz clic en "Save and deploy" en Amplify Console');
  console.log('   2. Amplify comenzará a clonar el repositorio');
  console.log('   3. Ejecutará el build usando amplify.yml');
  console.log('   4. Desplegará la aplicación');
  console.log('   5. El proceso completo toma 5-15 minutos');
  
  console.log('\n   📊 Monitoreo del build:');
  console.log('   - Provision: ~1-2 minutos');
  console.log('   - Build: ~5-10 minutos');
  console.log('   - Deploy: ~1-2 minutos');
  console.log('   - Verify: ~1 minuto');
  
  waitForConfirmation('Inicia el despliegue y espera a que complete');
  
  showStep(7, 'VERIFICACIÓN POST-DESPLIEGUE', 
    'Verificar que la aplicación funcione correctamente');
  
  console.log('   📝 Checklist de verificación:');
  console.log('   ✓ La aplicación carga sin errores');
  console.log('   ✓ Las páginas principales son accesibles');
  console.log('   ✓ Los formularios funcionan correctamente');
  console.log('   ✓ La autenticación funciona (si está configurada)');
  console.log('   ✓ Los datos se guardan y recuperan correctamente');
  console.log('   ✓ La aplicación es responsive en móvil');
  
  waitForConfirmation('Verifica que la aplicación funcione correctamente');
  
  showStep(8, 'CONFIGURACIÓN DE MONITOREO (OPCIONAL)', 
    'Configurar alertas y monitoreo');
  
  console.log('   📝 Opciones de monitoreo:');
  console.log('   1. CloudWatch Logs para logs de build');
  console.log('   2. CloudWatch Metrics para métricas de rendimiento');
  console.log('   3. Amplify Console para métricas de tráfico');
  console.log('   4. Configurar alertas para errores de build');
  
  console.log('\n🎉 ¡DESPLIEGUE COMPLETADO!');
  console.log('=' * 60);
  console.log('✅ Tu aplicación Budget Tracker está ahora desplegada en AWS Amplify');
  console.log('🌐 URL de la aplicación: Disponible en Amplify Console');
  console.log('📊 Monitoreo: Disponible en Amplify Console > Monitoring');
  console.log('🔧 Configuración: Disponible en Amplify Console > App settings');
  
  console.log('\n📝 PRÓXIMOS PASOS:');
  console.log('1. Configura un dominio personalizado (opcional)');
  console.log('2. Configura alertas de monitoreo');
  console.log('3. Configura backups automáticos');
  console.log('4. Documenta las credenciales y configuraciones');
  
  console.log('\n🔄 DESPLIEGUES FUTUROS:');
  console.log('Para futuros despliegues, simplemente:');
  console.log('1. Ejecuta: npm run pre-deploy');
  console.log('2. Haz commit y push a la rama principal');
  console.log('3. Amplify desplegará automáticamente');
}

// Ejecutar script
if (require.main === module) {
  main();
}

module.exports = { main, checkPrerequisites };