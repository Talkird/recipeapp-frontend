import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Button } from './ui/Button';
import { SubTitle } from './ui/SubTitle';

interface WebQRScannerProps {
  onQRScanned: (data: string) => void;
  onError: (error: string) => void;
}

export const WebQRScanner: React.FC<WebQRScannerProps> = ({ onQRScanned, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    if (Platform.OS !== 'web') {
      onError('Este componente solo funciona en navegadores web');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment' // Usar cámara trasera si está disponible
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      setError(null);
      
      // Intentar importar y usar una librería de QR scanning
      // Nota: En una implementación real, necesitarías instalar una librería como 'qr-scanner'
      // o 'jsqr' para detectar códigos QR en el video
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al acceder a la cámara: ${errorMessage}`);
      onError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const handleManualInput = () => {
    // Fallback: permitir input manual del código QR
    Alert.prompt(
      'Código QR Manual',
      'Introduce el código QR manualmente:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: (text) => {
            if (text) {
              onQRScanned(text);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Componente solo disponible en navegadores web
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <View style={styles.videoContainer}>
        {/* @ts-ignore - Video element para React Native Web */}
        <video
          ref={videoRef}
          style={styles.video}
          autoPlay
          playsInline
          muted
        />
        {/* @ts-ignore - Canvas para procesamiento de imagen */}
        <canvas
          ref={canvasRef}
          style={styles.canvas}
        />
      </View>
      
      <View style={styles.controls}>
        {!isScanning ? (
          <Button onPress={startCamera} style={styles.button}>
            <SubTitle style={styles.buttonText}>
              Activar cámara web
            </SubTitle>
          </Button>
        ) : (
          <Button onPress={stopCamera} style={[styles.button, styles.stopButton]}>
            <SubTitle style={styles.stopButtonText}>
              Detener cámara
            </SubTitle>
          </Button>
        )}
        
        <Button onPress={handleManualInput} style={styles.manualButton}>
          <SubTitle style={styles.buttonText}>
            Introducir código manualmente
          </SubTitle>
        </Button>
      </View>
      
      <Text style={styles.infoText}>
        Nota: La detección automática de QR en navegadores web requiere librerías adicionales.
        Puedes introducir el código manualmente como alternativa.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  videoContainer: {
    width: 300,
    height: 200,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  canvas: {
    display: 'none',
  },
  controls: {
    gap: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  manualButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  stopButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
