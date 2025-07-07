import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { Button } from './ui/Button';
import { BarcodeScanningResult, CameraView, CameraType, useCameraPermissions } from 'expo-camera';

interface ExpoQRScannerProps {
  onQRScanned: (data: string) => void;
  onError: (error: string) => void;
}

export const ExpoQRScanner: React.FC<ExpoQRScannerProps> = ({ onQRScanned, onError }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // Solicitar permisos automáticamente
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    
    setScanned(true);
    console.log('✅ QR Code scanned:', data);
    onQRScanned(data);
  };

  const resetScanner = () => {
    setScanned(false);
  };

  if (permission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos acceso a la cámara para escanear códigos QR
        </Text>
        <Button onPress={requestPermission}>
          Conceder permisos
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <Text style={styles.scanText}>
              {scanned ? '✅ Código QR detectado' : '📱 Coloca el código QR dentro del marco'}
            </Text>
          </View>
        </View>
      </CameraView>
      
      <View style={styles.controls}>
        {scanned && (
          <Button onPress={resetScanner} style={styles.button}>
            Escanear otro código
          </Button>
        )}
        <Button 
          onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
          style={[styles.button, styles.flipButton]}
        >
          Cambiar cámara
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00ff00',
    borderRadius: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  flipButton: {
    backgroundColor: '#666',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
