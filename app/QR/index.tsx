import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Text, Platform } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import { primary } from "@/utils/colors";
import { WebQRScanner } from "@/components/WebQRScanner";

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWeb, setIsWeb] = useState(false);
  const [useWebScanner, setUseWebScanner] = useState(false);

  useEffect(() => {
    const webPlatform = Platform.OS === 'web';
    setIsWeb(webPlatform);
    setUseWebScanner(webPlatform);
    console.log("Platform:", Platform.OS);
  }, []);

  const handleQRScanned = (data: string) => {
    console.log("QR Escaneado:", data);
    setScanned(true);
    setScanning(false);
    setCameraActive(false);
    
    Alert.alert(
      "¡QR Escaneado!",
      `Código QR detectado: ${data}\n\nAsistencia registrada exitosamente`,
      [
        {
          text: "OK",
          onPress: () => {
            setScanned(false);
            console.log("Asistencia registrada con código:", data);
            // Aquí puedes agregar la lógica para registrar la asistencia en el backend
          }
        }
      ]
    );
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    handleQRScanned(data);
  };

  const handleWebQRError = (errorMessage: string) => {
    setError(errorMessage);
  };



  const handleDetenerEscaneo = () => {
    console.log("Deteniendo escaneo...");
    setScanning(false);
    setCameraActive(false);
    setScanned(false);
    setError(null);
  };

  const handleEscanearAhora = async () => {
    console.log("=== INICIO ESCANEO QR ===");
    console.log("Platform:", Platform.OS);
    console.log("Permisos actuales:", permission);
    
    setError(null);
    
    // Verificar soporte de plataforma
    if (isWeb) {
      Alert.alert(
        "Modo Web",
        "Estás usando la aplicación en un navegador web. La funcionalidad de cámara es limitada. ¿Quieres probar el escáner web?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Escáner Web", onPress: () => setUseWebScanner(true) }
        ]
      );
      return;
    }
    
    if (!permission) {
      console.log("No hay permisos disponibles");
      setError("Error al acceder a los permisos de cámara");
      return;
    }
    
    if (!permission.granted) {
      console.log("Solicitando permisos...");
      const permissionResult = await requestPermission();
      console.log("Resultado de permisos:", permissionResult);
      
      if (!permissionResult.granted) {
        setError("Sin permisos de cámara. Ve a configuración para habilitarlos.");
        return;
      }
    }

    try {
      console.log("Activando cámara...");
      setCameraActive(true);
      setScanning(true);
      setScanned(false);
      
      console.log("Estado después de activar:", {
        cameraActive: true,
        scanning: true,
        scanned: false,
        permission: permission?.granted
      });
      
      // Timeout de seguridad: detener escaneo después de 30 segundos
      setTimeout(() => {
        if (scanning && cameraActive) {
          Alert.alert(
            "Timeout",
            "No se detectó ningún código QR. ¿Quieres intentar nuevamente?",
            [
              {
                text: "Cancelar",
                onPress: () => handleDetenerEscaneo()
              },
              {
                text: "Reintentar",
                onPress: () => {
                  setScanning(true);
                  setScanned(false);
                }
              }
            ]
          );
        }
      }, 30000);
    } catch (err) {
      console.error("Error al activar la cámara:", err);
      setError("Error al activar la cámara. Verifica que tu dispositivo tenga una cámara disponible.");
    }
  };

  return (
    <View style={styles.container}>
      {useWebScanner && isWeb ? (
        <Column
          style={{
            flex: 1,
            gap: 32,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <Title style={styles.mainTitle}>
            Registrar asistencia - Modo Web
          </Title>
          
          <WebQRScanner 
            onQRScanned={handleQRScanned}
            onError={handleWebQRError}
          />
          
          <Button 
            onPress={() => setUseWebScanner(false)}
            style={[styles.scanButton, { backgroundColor: '#6c757d' }]}
          >
            <SubTitle style={styles.buttonText}>
              Volver al modo nativo
            </SubTitle>
          </Button>
        </Column>
      ) : (
        <Column
          style={{
            flex: 1,
            gap: 32,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <Title style={styles.mainTitle}>
            Registrar asistencia
          </Title>
          
          {/* Componente de cámara */}
          <View style={styles.cameraContainer}>
            {/* Debug info */}
            <Text style={styles.debugText}>
              Debug: Platform={Platform.OS} | Camera={cameraActive ? "ON" : "OFF"} | Permisos={permission?.granted ? "OK" : "NO"}
            </Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : cameraActive && permission?.granted && !isWeb ? (
              <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              >
                <View style={styles.scannerOverlay}>
                  <Text style={styles.scannerText}>
                    {scanning ? "Apunta al código QR" : "Cámara lista"}
                  </Text>
                </View>
              </CameraView>
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.cameraPlaceholder}>
                  {isWeb 
                    ? "⚠️ Funcionalidad web limitada" 
                    : !permission?.granted 
                    ? "Sin permisos de cámara" 
                    : "Presiona 'Escanear ahora' para activar la cámara"}
                </Text>
                {isWeb && (
                  <Text style={styles.webMessage}>
                    Para escanear códigos QR, usa la aplicación móvil
                  </Text>
                )}
              </View>
            )}
          </View>
          
          <SubTitle style={styles.instruction}>
            Escanea el QR del aula
          </SubTitle>
          
          {!cameraActive && !error ? (
            <View style={styles.buttonContainer}>
              <Button 
                onPress={handleEscanearAhora}
                style={styles.scanButton}
              >
                <SubTitle style={styles.buttonText}>
                  {isWeb ? "Modo Web - Limitado" : "Escanear ahora"}
                </SubTitle>
              </Button>
            </View>
          ) : error ? (
            <Button 
              onPress={() => setError(null)}
              style={[styles.scanButton, { backgroundColor: '#28a745' }]}
            >
              <SubTitle style={styles.buttonText}>
                Reintentar
              </SubTitle>
            </Button>
          ) : (
            <View style={{ gap: 16, alignItems: 'center' }}>
              <Text style={styles.statusText}>
                {scanning ? "Escaneando código QR..." : "Cámara lista"}
              </Text>
              <Button 
                onPress={handleDetenerEscaneo}
                style={[styles.scanButton, { backgroundColor: '#dc3545' }]}
              >
                <SubTitle style={styles.stopButtonText}>
                  Detener escaneo
                </SubTitle>
              </Button>
            </View>
          )}
        </Column>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mainTitle: {
    fontWeight: "bold",
    fontSize: 32,
    textAlign: "center",
  },
  instruction: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  scanButton: {
    backgroundColor: primary,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 12,
    width: "85%",
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  stopButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  statusText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cameraContainer: {
    width: 250,
    height: 180,
    borderRadius: 12,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  camera: {
    flex: 1,
    width: "100%",
    borderRadius: 12,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cameraActive: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  cameraText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  instructionText: {
    color: "#CCCCCC",
    fontSize: 12,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cameraPlaceholder: {
    color: "#666666",
    fontSize: 14,
    textAlign: "center",
  },
  debugText: {
    position: "absolute",
    top: 5,
    left: 5,
    color: "#FF0000",
    fontSize: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 2,
    zIndex: 1000,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  webMessage: {
    color: "#666666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  buttonContainer: {
    gap: 16,
    alignItems: "center",
    width: "100%",
  },
});
