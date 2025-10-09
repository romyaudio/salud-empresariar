#!/usr/bin/env node

/**
 * Script para debuggear problemas de verificación de email
 */

console.log('🔍 Debug: Problemas de verificación de email');
console.log('');
console.log('❌ POSIBLES CAUSAS DEL ERROR:');
console.log('   1. Código de verificación incorrecto');
console.log('   2. Código expirado (válido por 24 horas)');
console.log('   3. Usuario ya verificado');
console.log('   4. Demasiados intentos fallidos');
console.log('   5. Problemas de conectividad con AWS');
console.log('');
console.log('✅ SOLUCIONES IMPLEMENTADAS:');
console.log('   1. Mejor manejo de errores con mensajes específicos');
console.log('   2. Botón para reenviar código de verificación');
console.log('   3. Auto-login después de verificación exitosa');
console.log('   4. Logging detallado para debugging');
console.log('');
console.log('🔧 PASOS PARA DEBUGGEAR:');
console.log('   1. Abre las herramientas de desarrollador (F12)');
console.log('   2. Ve a la pestaña Console');
console.log('   3. Intenta verificar el código');
console.log('   4. Revisa los logs de error detallados');
console.log('   5. Si el código está correcto, intenta reenviarlo');
console.log('');
console.log('📧 VERIFICAR EMAIL:');
console.log('   - Revisa la bandeja de entrada');
console.log('   - Revisa la carpeta de spam/correo no deseado');
console.log('   - El código debe ser de 6 dígitos');
console.log('   - El código expira en 24 horas');
console.log('');
console.log('🚨 SI EL PROBLEMA PERSISTE:');
console.log('   1. Verifica que el email esté escrito correctamente');
console.log('   2. Intenta con otro email');
console.log('   3. Revisa la configuración de AWS Cognito');
console.log('   4. Verifica que el User Pool esté configurado correctamente');