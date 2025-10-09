#!/usr/bin/env node

// Script para verificar la configuración de S3
const fs = require('fs');
const path = require('path');

// Leer .env.local manualmente
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

console.log('🔍 Verificando configuración de S3...\n');

const requiredVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID', 
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET_NAME'
];

const publicVars = [
  'NEXT_PUBLIC_AWS_S3_BUCKET_NAME',
  'NEXT_PUBLIC_AWS_S3_BUCKET_URL'
];

let hasErrors = false;

console.log('📋 Variables de entorno del servidor:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const displayValue = varName.includes('SECRET') || varName.includes('KEY') 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
    hasErrors = true;
  }
});

console.log('\n📋 Variables públicas (frontend):');
publicVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: NO CONFIGURADA (opcional)`);
  }
});

console.log('\n🧪 Configuración de S3 Client:');
if (!hasErrors) {
  try {
    const { S3Client } = require('@aws-sdk/client-s3');
    
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    
    console.log('✅ S3 Client creado correctamente');
    console.log(`✅ Región: ${process.env.AWS_REGION}`);
    console.log(`✅ Bucket: ${process.env.AWS_S3_BUCKET_NAME}`);
  } catch (error) {
    console.log(`❌ Error creando S3 Client: ${error.message}`);
    hasErrors = true;
  }
} else {
  console.log('❌ No se puede crear S3 Client - faltan variables');
}

console.log('\n📝 Resumen:');
if (hasErrors) {
  console.log('❌ Hay errores en la configuración');
  console.log('\n🔧 Para solucionarlo:');
  console.log('1. Copia .env.example a .env.local');
  console.log('2. Completa las variables de AWS S3');
  console.log('3. Reinicia el servidor: npm run dev');
} else {
  console.log('✅ Configuración de S3 correcta');
  console.log('\n🚀 Puedes probar subiendo una imagen en /profile');
}

process.exit(hasErrors ? 1 : 0);