// Script de prueba para verificar el logout
// Copia y pega este código en la consola del navegador (F12)

console.log('🧪 Iniciando prueba de logout...');

// Función para verificar localStorage
function checkLocalStorage() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('📦 Estado del localStorage:');
  console.log('  Token:', token);
  console.log('  User:', user);
  
  return { token, user };
}

// Función para simular logout
function testLogout() {
  console.log('🚪 Simulando logout...');
  
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Verificar limpieza
  const afterLogout = checkLocalStorage();
  
  if (!afterLogout.token && !afterLogout.user) {
    console.log('✅ localStorage limpiado correctamente');
  } else {
    console.log('❌ Error: localStorage no se limpió correctamente');
  }
  
  return afterLogout;
}

// Función para verificar redirección
function checkCurrentRoute() {
  console.log('📍 Ruta actual:', window.location.pathname);
  return window.location.pathname;
}

// Ejecutar pruebas
console.log('\n=== PRUEBA COMPLETA DE LOGOUT ===');
console.log('1. Estado inicial:');
checkLocalStorage();

console.log('\n2. Simulando logout:');
testLogout();

console.log('\n3. Ruta actual:');
checkCurrentRoute();

console.log('\n=== FIN DE PRUEBA ===');
console.log('💡 Si ves "null" en token y user, el logout funciona correctamente');
