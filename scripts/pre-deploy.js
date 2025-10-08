#!/usr/bin/env node

/**
 * Script de pre-deploy que ejecuta todas las verificaciones necesarias
 * antes de hacer push a git y deploy en Amplify Console
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando verificaciones pre-deploy...\n');

// Función para ejecutar comandos y mostrar output
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    console.log(`✅ ${description} - Completado\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} - Error:`);
    console.error(error.stdout || error.message);
    return false;
  }
}

// Función para verificar archivos críticos
function checkCriticalFiles() {
  console.log('📋 Verificando archivos críticos...');
  
  const criticalFiles = [
    'package.json',
    'next.config.js',
    'amplify.yml',
    'scripts/create-amplify-outputs.js',
    '.npmrc'
  ];
  
  let allFilesExist = true;
  
  criticalFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.error(`❌ Archivo crítico faltante: ${file}`);
      allFilesExist = false;
    }
  });
  
  if (allFilesExist) {
    console.log('✅ Verificación de archivos críticos - Completado\n');
  }
  
  return allFilesExist;
}

// Función principal
async function main() {
  let success = true;
  
  // 1. Verificar archivos críticos
  if (!checkCriticalFiles()) {
    success = false;
  }
  
  // 2. Limpiar cache de npm
  if (!runCommand('npm cache clean --force', 'Limpiando cache de npm')) {
    success = false;
  }
  
  // 3. Instalar dependencias
  if (!runCommand('npm install', 'Instalando dependencias')) {
    success = false;
  }
  
  // 4. Verificar tipos de TypeScript
  if (!runCommand('npm run type-check', 'Verificando tipos de TypeScript')) {
    success = false;
  }
  
  // 5. Ejecutar tests
  if (!runCommand('npm run test -- --passWithNoTests --silent --watchAll=false', 'Ejecutando tests')) {
    success = false;
  }
  
  // 6. Generar amplify_outputs.json
  if (!runCommand('node scripts/create-amplify-outputs.js', 'Generando amplify_outputs.json')) {
    success = false;
  }
  
  // 7. Build de producción
  if (!runCommand('npm run build', 'Construyendo aplicación para producción')) {
    success = false;
  }
  
  // 8. Verificar que el build generó los archivos correctos
  console.log('📋 Verificando archivos de build...');
  if (!fs.existsSync('.next')) {
    console.error('❌ Directorio .next no encontrado después del build');
    success = false;
  } else if (!fs.existsSync('amplify_outputs.json')) {
    console.error('❌ Archivo amplify_outputs.json no encontrado');
    success = false;
  } else {
    console.log('✅ Verificación de archivos de build - Completado\n');
  }
  
  // Resultado final
  if (success) {
    console.log('🎉 ¡Todas las verificaciones pasaron exitosamente!');
    console.log('✅ La aplicación está lista para deploy en Amplify Console');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. git add .');
    console.log('   2. git commit -m "feat: Ready for deploy"');
    console.log('   3. git push origin main');
  } else {
    console.log('❌ Algunas verificaciones fallaron');
    console.log('🔧 Por favor, corrige los errores antes de hacer deploy');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Error inesperado:', error);
  process.exit(1);
});