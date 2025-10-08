#!/usr/bin/env node

/**
 * Script para probar el registro de transacciones localmente
 */

console.log('🧪 Probando registro de transacciones localmente...\n');

// Simular localStorage en Node.js
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Simular window
global.window = {
  localStorage: global.localStorage
};

// Importar las clases necesarias
const { TransactionModel } = require('../src/lib/models/Transaction.ts');

// Datos de prueba
const testTransactionData = {
  type: 'income',
  amount: '1500000',
  description: 'Venta de productos - Prueba local',
  category: 'Ingresos',
  date: new Date().toISOString().split('T')[0]
};

console.log('📝 Datos de prueba:', testTransactionData);

try {
  // Validar datos
  console.log('\n🔍 Validando datos...');
  const validation = TransactionModel.validate(testTransactionData);
  
  if (!validation.isValid) {
    console.error('❌ Validación falló:', validation.errors);
    process.exit(1);
  }
  
  console.log('✅ Validación exitosa');
  
  // Crear transacción
  console.log('\n🏗️ Creando transacción...');
  const transaction = TransactionModel.create(testTransactionData, 'test-user-123');
  
  console.log('✅ Transacción creada:', transaction);
  
  // Simular guardado en localStorage
  console.log('\n💾 Simulando guardado en localStorage...');
  
  const transactions = JSON.parse(localStorage.getItem('budget_tracker_transactions') || '[]');
  transactions.push(transaction);
  localStorage.setItem('budget_tracker_transactions', JSON.stringify(transactions));
  
  console.log('✅ Transacción guardada en localStorage');
  console.log('📊 Total de transacciones:', transactions.length);
  
  // Verificar que se guardó correctamente
  const savedTransactions = JSON.parse(localStorage.getItem('budget_tracker_transactions') || '[]');
  const savedTransaction = savedTransactions.find(t => t.id === transaction.id);
  
  if (savedTransaction) {
    console.log('✅ Verificación exitosa - Transacción encontrada en localStorage');
    console.log('🎉 ¡Todas las pruebas pasaron!');
  } else {
    console.error('❌ Error - Transacción no encontrada en localStorage');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error durante las pruebas:', error);
  process.exit(1);
}

console.log('\n📋 Resumen:');
console.log('- ✅ Validación de datos');
console.log('- ✅ Creación de transacción');
console.log('- ✅ Guardado en localStorage');
console.log('- ✅ Verificación de datos guardados');
console.log('\n🎯 El sistema de transacciones funciona correctamente en modo local');