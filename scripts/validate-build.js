#!/usr/bin/env node

/**
 * Script de validación post-build
 * Verifica que el build de Next.js se haya completado correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validando build de Next.js...');

const buildDir = path.join(process.cwd(), '.next');
const requiredFiles = [
  '.next/BUILD_ID',
  '.next/static',
  '.next/server',
  '.next/cache'
];

const requiredPages = [
  '.next/server/pages/_app.js',
  '.next/server/pages/_document.js',
  '.next/server/pages/index.js'
];

let hasErrors = false;

// Verificar que el directorio .next existe
if (!fs.existsSync(buildDir)) {
  console.error('❌ Error: Directorio .next no encontrado');
  hasErrors = true;
} else {
  console.log('✅ Directorio .next encontrado');
}

// Verificar archivos requeridos
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: Archivo requerido no encontrado: ${file}`);
    hasErrors = true;
  } else {
    console.log(`✅ Archivo encontrado: ${file}`);
  }
});

// Verificar páginas principales
requiredPages.forEach(page => {
  const pagePath = path.join(process.cwd(), page);
  if (!fs.existsSync(pagePath)) {
    console.warn(`⚠️  Advertencia: Página no encontrada: ${page}`);
  } else {
    console.log(`✅ Página encontrada: ${page}`);
  }
});

// Verificar tamaño del build
try {
  const stats = fs.statSync(buildDir);
  console.log(`📊 Directorio .next creado: ${stats.birthtime}`);
  
  // Verificar que el build no sea demasiado antiguo (más de 1 hora)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  if (stats.birthtime < oneHourAgo) {
    console.warn('⚠️  Advertencia: El build parece ser antiguo');
  }
} catch (error) {
  console.error('❌ Error al verificar estadísticas del build:', error.message);
  hasErrors = true;
}

// Verificar BUILD_ID
try {
  const buildIdPath = path.join(buildDir, 'BUILD_ID');
  if (fs.existsSync(buildIdPath)) {
    const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
    console.log(`🆔 BUILD_ID: ${buildId}`);
  }
} catch (error) {
  console.error('❌ Error al leer BUILD_ID:', error.message);
  hasErrors = true;
}

// Verificar archivos estáticos
try {
  const staticDir = path.join(buildDir, 'static');
  if (fs.existsSync(staticDir)) {
    const staticFiles = fs.readdirSync(staticDir);
    console.log(`📁 Archivos estáticos encontrados: ${staticFiles.length}`);
  }
} catch (error) {
  console.error('❌ Error al verificar archivos estáticos:', error.message);
  hasErrors = true;
}

// Verificar manifest
try {
  const manifestPath = path.join(buildDir, 'build-manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`📋 Páginas en manifest: ${Object.keys(manifest.pages || {}).length}`);
  }
} catch (error) {
  console.warn('⚠️  Advertencia: No se pudo leer build-manifest.json');
}

if (hasErrors) {
  console.error('\n❌ Validación de build FALLÓ');
  console.error('El build no está completo o tiene errores críticos');
  process.exit(1);
} else {
  console.log('\n✅ Validación de build EXITOSA');
  console.log('El build está listo para despliegue');
}