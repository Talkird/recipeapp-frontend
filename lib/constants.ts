import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configuración manual para casos específicos (opcional)
const MANUAL_CONFIG = {
  // Descomenta y modifica según necesites
  // FORCE_IP: '192.168.1.100', // Forzar una IP específica
  // FORCE_PORT: '8080', // Forzar un puerto específico
  // PRODUCTION_URL: 'https://tu-servidor-produccion.com', // URL de producción
} as {
  FORCE_IP?: string;
  FORCE_PORT?: string;
  PRODUCTION_URL?: string;
};

// Función para obtener la URL base de la API
const getApiUrl = () => {
  // Si estamos en desarrollo
  if (__DEV__) {
    // En web, usar localhost
    if (Platform.OS === 'web') {
      const port = MANUAL_CONFIG.FORCE_PORT || '8080';
      return `http://localhost:${port}`;
    }
    
    // En dispositivos móviles, usar la IP de tu computadora
    let host = null;
    
    // 1. Primero intentar con IP manual si está configurada
    if (MANUAL_CONFIG.FORCE_IP) {
      host = MANUAL_CONFIG.FORCE_IP;
    }
    // 2. Luego intentar obtener IP automáticamente desde Expo
    else if (Constants.expoGoConfig?.debuggerHost) {
      host = Constants.expoGoConfig.debuggerHost.split(':')[0];
    }
    // 3. Intentar con manifest (alternativa)
    else if (Constants.manifest?.debuggerHost) {
      host = Constants.manifest.debuggerHost.split(':')[0];
    }
    // 4. Intentar con manifest2 (Expo SDK 46+)
    else if (Constants.manifest2?.extra?.expoGo?.debuggerHost) {
      host = Constants.manifest2.extra.expoGo.debuggerHost.split(':')[0];
    }
    
    if (host) {
      const port = MANUAL_CONFIG.FORCE_PORT || '8080';
      return `http://${host}:${port}`;
    }
    
    // Fallback: mostrar error útil
    console.error('❌ No se pudo determinar la IP automáticamente');
    console.error('💡 Opciones para solucionarlo:');
    console.error('1. Descomenta FORCE_IP en constants.ts con tu IP local');
    console.error('2. Asegúrate de que el servidor Expo esté corriendo');
    console.error('3. Verifica que estés en la misma red WiFi');
    
    // Retornar IP por defecto como último recurso
    return 'http://192.168.0.172:8080';
  }
  
  // En producción, usar servidor real
  return MANUAL_CONFIG.PRODUCTION_URL || 'https://tu-servidor-produccion.com';
};

export const API_BASE_URL = getApiUrl();

// URLs específicas de la API
export const API_URLS = {
  USUARIOS: `${API_BASE_URL}/api/usuarios`,
  ALUMNOS: `${API_BASE_URL}/api/alumnos`,
  CURSOS: `${API_BASE_URL}/api/cursos`,
  RECETAS: `${API_BASE_URL}/api/recetas`,
  ASISTENCIAS: `${API_BASE_URL}/asistencias`,
  QR: `${API_BASE_URL}/api/qr`,
  AUTH: `${API_BASE_URL}/auth`,
  INSCRIPCIONES: `${API_BASE_URL}/api/inscripciones`,
  TIPOS_RECETA: `${API_BASE_URL}/api/tiporeceta`,
  INGREDIENTES: `${API_BASE_URL}/ingredientes`,
  UNIDADES: `${API_BASE_URL}/api/unidades`,
};

// Función para obtener tu IP local (útil para debugging)
export const getLocalIpAddress = () => {
  const debuggerHost = Constants.expoGoConfig?.debuggerHost;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }
  return 'localhost';
};

// Función para debug
export const logApiConfig = () => {
  console.log('=== API Configuration ===');
  console.log('Platform:', Platform.OS);
  console.log('Dev Mode:', __DEV__);
  console.log('API Base URL:', API_BASE_URL);
  console.log('Local IP:', getLocalIpAddress());
  console.log('Expo Config:', {
    debuggerHost: Constants.expoGoConfig?.debuggerHost,
    manifest: Constants.manifest?.debuggerHost,
    manifest2: Constants.manifest2?.extra?.expoGo?.debuggerHost,
  });
  console.log('Manual Config:', MANUAL_CONFIG);
  console.log('=========================');
};

// Función para obtener instrucciones de configuración
export const getSetupInstructions = () => {
  return {
    currentIP: getLocalIpAddress(),
    instructions: [
      '📱 Para usar en Expo Go:',
      '1. Asegúrate de estar en la misma red WiFi',
      '2. Si no funciona automáticamente, edita constants.ts',
      '3. Descomenta y modifica FORCE_IP con tu IP local',
      '',
      '💻 Para obtener tu IP local:',
      '• Windows: ejecuta "ipconfig" en terminal',
      '• Mac/Linux: ejecuta "ifconfig" en terminal',
      '• Busca tu IP en la sección WiFi/Ethernet',
      '',
      '🔧 Para compartir con amigos:',
      '• Ellos deben modificar FORCE_IP con su IP local',
      '• O usar la detección automática si están en la misma red',
    ],
  };
};