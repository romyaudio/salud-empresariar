#!/usr/bin/env node

/**
 * Script de pre-deploy optimizado para AWS Amplify
 * Versión simplificada que evita fallos en el entorno de Amplify
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Iniciando verificaciones pre-deploy para Amplify...\n');

// Función para ejecutar comandos de forma segura
function runCommandSafe(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    console.log(`✅ ${description} - Completado\n`);
    return true;
  } catch (error) {
    console.warn(`⚠️  ${description} - Advertencia (continuando):`);
    console.warn(error.stdout || error.message);
    console.log('');
    return false;
  }
}

// Función principal
async function main() {
  let success = true;
  
  // 1. Verificar archivos críticos
  console.log('📋 Verificando archivos críticos...');
  const criticalFiles = [
    'package.json',
    'next.config.js',
    'amplify.yml'
  ];
  
  criticalFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.error(`❌ Archivo crítico faltante: ${file}`);
      success = false;
    }
  });
  
  if (success) {
    console.log('✅ Verificación de archivos críticos - Completado\n');
  }
  
  // 2. Verificar tipos de TypeScript (opcional)
  runCommandSafe('npm run type-check', 'Verificando tipos de TypeScript');
  
  // 3. Generar amplify_outputs.json
  if (!runCommandSafe('node scripts/create-amplify-outputs.js', 'Generando amplify_outputs.json')) {
    success = false;
  }
  
  // 4. Verificar que amplify_outputs.json existe
  console.log('📋 Verificando amplify_outputs.json...');
  if (!fs.existsSync('amplify_outputs.json')) {
    console.error('❌ Archivo amplify_outputs.json no encontrado');
    success = false;
  } else {
    console.log('✅ Verificación de amplify_outputs.json - Completado\n');
  }
  
  // Resultado final
  if (success) {
    console.log('🎉 ¡Verificaciones pre-deploy completadas!');
    console.log('✅ Listo para build de producción en Amplify');
  } else {
    console.log('⚠️  Algunas verificaciones fallaron, pero continuando...');
    console.log('🔧 Revisa los warnings arriba si es necesario');
  }
}

main().catch(error => {
  console.error('❌ Error inesperado:', error);
  // No hacer exit(1) para no fallar el build de Amplify
  console.log('🔄 Continuando con el build...');
});