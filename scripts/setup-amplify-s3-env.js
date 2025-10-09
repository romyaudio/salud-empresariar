/**
 * Script para configurar variables de entorno S3 en AWS Amplify
 * Este script te guía paso a paso para configurar S3 en Amplify Console
 */

require('dotenv').config({ path: '.env.local' });

console.log('🚀 Configuración de S3 para AWS Amplify');
console.log('=' .repeat(50));

// Leer variables actuales
const s3Config = {
  // Variables del servidor (privadas)
  AWS_REGION: process.env.AWS_REGION,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  
  // Variables del cliente (públicas)
  NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
  NEXT_PUBLIC_AWS_S3_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
  NEXT_PUBLIC_AWS_S3_BUCKET_URL: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL,
  NEXT_PUBLIC_AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
};

console.log('\n📋 PASO 1: Verificar Variables Locales');
console.log('-'.repeat(40));

let allConfigured = true;
Object.entries(s3Config).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: Configurada`);
  } else {
    console.log(`❌ ${key}: NO CONFIGURADA`);
    allConfigured = false;
  }
});

if (!allConfigured) {
  console.log('\n⚠️  ADVERTENCIA: Algunas variables no están configuradas en .env.local');
  console.log('Revisa tu archivo .env.local antes de continuar.');
  process.exit(1);
}

console.log('\n🎯 PASO 2: Configurar en AWS Amplify Console');
console.log('-'.repeat(40));
console.log('1. Ve a: https://console.aws.amazon.com/amplify/');
console.log('2. Selecciona tu aplicación: salud-empresariar');
console.log('3. En el menú lateral, haz clic en "Environment variables"');
console.log('4. Haz clic en "Manage variables"');
console.log('5. Agrega las siguientes variables una por una:');

console.log('\n📝 VARIABLES A AGREGAR:');
console.log('-'.repeat(40));

// Variables del servidor
console.log('\n🔐 Variables del Servidor (Server-side):');
console.log(`AWS_REGION=${s3Config.AWS_REGION}`);
console.log(`AWS_S3_BUCKET_NAME=${s3Config.AWS_S3_BUCKET_NAME}`);
console.log(`AWS_ACCESS_KEY_ID=${s3Config.AWS_ACCESS_KEY_ID}`);
console.log(`AWS_SECRET_ACCESS_KEY=${s3Config.AWS_SECRET_ACCESS_KEY}`);

// Variables del cliente
console.log('\n🌐 Variables del Cliente (Client-side):');
console.log(`NEXT_PUBLIC_AWS_REGION=${s3Config.NEXT_PUBLIC_AWS_REGION}`);
console.log(`NEXT_PUBLIC_AWS_S3_BUCKET_NAME=${s3Config.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}`);
console.log(`NEXT_PUBLIC_AWS_S3_BUCKET_URL=${s3Config.NEXT_PUBLIC_AWS_S3_BUCKET_URL}`);
console.log(`NEXT_PUBLIC_AWS_ACCESS_KEY_ID=${s3Config.NEXT_PUBLIC_AWS_ACCESS_KEY_ID}`);
console.log(`NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=${s3Config.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY}`);

console.log('\n🔧 PASO 3: Después de Agregar Variables');
console.log('-'.repeat(40));
console.log('1. Haz clic en "Save" en Amplify Console');
console.log('2. Ve a la pestaña "Deployments"');
console.log('3. Haz clic en "Redeploy this version"');
console.log('4. Espera a que termine el deployment');

console.log('\n✅ PASO 4: Verificar Configuración');
console.log('-'.repeat(40));
console.log('Una vez que termine el deployment, verifica que funcione:');
console.log('1. Ve a tu app en producción');
console.log('2. Visita: https://tu-app.amplifyapp.com/api/s3/verify-config');
console.log('3. Deberías ver: "status": "SUCCESS"');
console.log('4. Prueba subir una imagen de perfil');

console.log('\n🎉 ¡Listo!');
console.log('Una vez completados estos pasos, S3 funcionará en producción.');

console.log('\n📞 SOPORTE:');
console.log('Si tienes problemas, revisa:');
console.log('- docs/AMPLIFY_S3_SETUP.md para guía detallada');
console.log('- Logs de Amplify en la consola');
console.log('- Browser DevTools > Console para errores');

// Generar archivo de respaldo con las variables
const backupContent = `# Variables de S3 para AWS Amplify
# Generado automáticamente - ${new Date().toISOString()}

# Variables del Servidor (Server-side)
AWS_REGION=${s3Config.AWS_REGION}
AWS_S3_BUCKET_NAME=${s3Config.AWS_S3_BUCKET_NAME}
AWS_ACCESS_KEY_ID=${s3Config.AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${s3Config.AWS_SECRET_ACCESS_KEY}

# Variables del Cliente (Client-side)
NEXT_PUBLIC_AWS_REGION=${s3Config.NEXT_PUBLIC_AWS_REGION}
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=${s3Config.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}
NEXT_PUBLIC_AWS_S3_BUCKET_URL=${s3Config.NEXT_PUBLIC_AWS_S3_BUCKET_URL}
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=${s3Config.NEXT_PUBLIC_AWS_ACCESS_KEY_ID}
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=${s3Config.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY}

# INSTRUCCIONES:
# 1. Copia estas variables en AWS Amplify Console
# 2. Ve a Environment variables
# 3. Agrega cada variable una por una
# 4. Guarda y redeploy
`;

require('fs').writeFileSync('AMPLIFY_S3_VARIABLES.txt', backupContent);
console.log('\n💾 Archivo generado: AMPLIFY_S3_VARIABLES.txt');
console.log('   (Contiene todas las variables para copiar/pegar)');