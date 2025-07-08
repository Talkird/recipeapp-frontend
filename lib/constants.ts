import { Platform } from "react-native";
import Constants from "expo-constants";

// Configuración manual para casos específicos (opcional)
const MANUAL_CONFIG = {
  // Descomenta y modifica según necesites
  // FORCE_IP: '192.168.1.100', // Forzar una IP específica
  // FORCE_PORT: '8080', // Forzar un puerto específico
  PRODUCTION_URL:
    "https://legendary-carnival-49gj4755q7gfj95-8080.app.github.dev", // URL de producción
} as {
  FORCE_IP?: string;
  FORCE_PORT?: string;
  PRODUCTION_URL?: string;
};

// Función para obtener la URL base de la API
const getApiUrl = () => {
  // Usar siempre GitHub Codespaces URL
  return "https://legendary-carnival-49gj4755q7gfj95-8080.app.github.dev";
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
    return debuggerHost.split(":")[0];
  }
  return "localhost";
};

// Función para debug
export const logApiConfig = () => {
  console.log("=== API Configuration ===");
  console.log("Platform:", Platform.OS);
  console.log("Dev Mode:", __DEV__);
  console.log("API Base URL:", API_BASE_URL);
  console.log("Local IP:", getLocalIpAddress());
  console.log("Expo Config:", {
    debuggerHost: Constants.expoGoConfig?.debuggerHost,
    manifest: Constants.manifest?.debuggerHost,
    manifest2: Constants.manifest2?.extra?.expoGo?.debuggerHost,
  });
  console.log("Manual Config:", MANUAL_CONFIG);
  console.log("=========================");
};

// Función para obtener instrucciones de configuración
export const getSetupInstructions = () => {
  return {
    currentIP: getLocalIpAddress(),
    instructions: [
      "📱 Para usar en Expo Go:",
      "1. Asegúrate de estar en la misma red WiFi",
      "2. Si no funciona automáticamente, edita constants.ts",
      "3. Descomenta y modifica FORCE_IP con tu IP local",
      "",
      "💻 Para obtener tu IP local:",
      '• Windows: ejecuta "ipconfig" en terminal',
      '• Mac/Linux: ejecuta "ifconfig" en terminal',
      "• Busca tu IP en la sección WiFi/Ethernet",
      "",
      "🔧 Para compartir con amigos:",
      "• Ellos deben modificar FORCE_IP con su IP local",
      "• O usar la detección automática si están en la misma red",
    ],
  };
};
