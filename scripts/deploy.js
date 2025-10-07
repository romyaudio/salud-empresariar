#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando proceso de despliegue manual...\n');

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

// Función para verificar archivos críticos
function checkCriticalFiles() {
  const criticalFiles = [
    'package.json',
    'next.config.js',
    'amplify.yml',
    'src/app/page.tsx'
  ];
  
  console.log('🔍 Verificando archivos críticos...');
  for (const file of criticalFiles) {
    if (!fs.existsSync(file)) {
      console.error(`❌ Archivo crítico faltante: ${file}`);
      process.exit(1);
    }
  }
  console.log('✅ Todos los archivos críticos están presentes\n');
}

// Función para mostrar checklist pre-despliegue
function showPreDeployChecklist() {
  console.log('📝 CHECKLIST PRE-DESPLIEGUE:');
  console.log('   □ ¿Has probado la aplicación localmente?');
  console.log('   □ ¿Todos los tests pasan?');
  console.log('   □ ¿Has revisado los cambios en Git?');
  console.log('   □ ¿Las variables de entorno están configuradas?');
  console.log('   □ ¿Has hecho backup de la versión actual?');
  console.log('\n⚠️  Presiona Ctrl+C para cancelar si algo no está listo\n');
  
  // Pausa de 5 segundos para revisar
  console.log('⏳ Esperando 5 segundos para revisar...');
  execSync('timeout 5 2>nul || sleep 5', { stdio: 'inherit' });
}

// Función principal
async function deploy() {
  try {
    // Mostrar checklist
    showPreDeployChecklist();
    
    // Verificar archivos críticos
    checkCriticalFiles();
    
    // Limpiar dependencias y reinstalar
    runCommand('npm ci --prefer-offline --no-audit', 'Instalando dependencias limpias');
    
    // Ejecutar verificación de tipos
    runCommand('npm run type-check', 'Verificación de tipos TypeScript');
    
    // Ejecutar tests
    runCommand('npm run test -- --passWithNoTests --silent --watchAll=false', 'Ejecutando tests');
    
    // Ejecutar lint
    runCommand('npm run lint', 'Verificando código con ESLint');
    
    // Build de producción
    runCommand('npm run build', 'Generando build de producción');
    
    console.log('🎉 ¡Build completado exitosamente!');
    console.log('\n📋 PRÓXIMOS PASOS MANUALES:');
    console.log('1. Sube los cambios a GitHub:');
    console.log('   git add .');
    console.log('   git commit -m "feat: preparar para despliegue"');
    console.log('   git push origin main');
    console.log('\n2. Ve a AWS Amplify Console');
    console.log('3. Conecta tu repositorio de GitHub');
    console.log('4. Configura las variables de entorno si es necesario');
    console.log('5. Inicia el despliegue desde la consola de Amplify');
    console.log('\n✨ ¡Listo para desplegar!');
    
  } catch (error) {
    console.error('❌ Error durante el proceso de despliegue:', error.message);
    process.exit(1);
  }
}

// Ejecutar despliegue
deploy();