import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Text, Platform } from "react-native";
import { ExpoQRScanner } from "@/components/ExpoQRScanner";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import { primary } from "@/utils/colors";
import { useCursoStore } from "@/stores/courses";
import { useUserStore } from "@/stores/user";

export default function QRScanner() {
  const { courseId } = useLocalSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const { getAlumnoId } = useUserStore();
  const { flujoQRAsistencia } = useCursoStore();

  useEffect(() => {
    // Verificar si estamos en web y mostrar mensaje de no compatibilidad
    if (Platform.OS === 'web') {
      Alert.alert(
        "No Compatible",
        "El escáner QR solo está disponible en dispositivos móviles (Android/iOS). Por favor, utiliza la aplicación móvil.",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    }
  }, []);

  const extraerDatosDelQR = (qrData: string) => {
    try {
      // Formato esperado: "CRONOGRAMA:123:CURSO:456" o JSON
      if (qrData.includes(':')) {
        const parts = qrData.split(':');
        return {
          idCronograma: parseInt(parts[1]),
          idCurso: parseInt(parts[3])
        };
      } else {
        // Si es JSON
        const data = JSON.parse(qrData);
        return {
          idCronograma: data.idCronograma,
          idCurso: data.idCurso
        };
      }
    } catch (error) {
      console.error("Error al extraer datos del QR:", error);
      return null;
    }
  };

  const handleQRScanned = async (qrData: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      if (Platform.OS === 'web') {
        Alert.alert("No Compatible", "El escáner QR solo está disponible en dispositivos móviles (Android/iOS). Por favor, utiliza la aplicación móvil.");
        return;
      }
      const alumnoId = await getAlumnoId();
      if (!alumnoId) {
        Alert.alert("Error", "No se pudo obtener la información del alumno");
        return;
      }
      const datosQR = extraerDatosDelQR(qrData);
      if (!datosQR) {
        Alert.alert("Error", "No se pudieron extraer los datos del código QR");
        return;
      }
      const resultado = await flujoQRAsistencia({ codigoQR: qrData, idAlumno: alumnoId, idCronograma: datosQR.idCronograma });
      if (!resultado.validacion?.valido) {
        Alert.alert("QR Inválido", resultado.validacion?.mensaje || "El código QR no es válido");
        return;
      }
      if (!resultado.registro?.exitoso) {
        Alert.alert("Error en el registro", resultado.registro?.mensaje || "No se pudo registrar la asistencia");
        return;
      }
      router.push({
        pathname: "/QR/success",
        params: {
          cursoNombre: resultado.registro.nombreCurso,
          sedeNombre: resultado.registro.nombreSede,
          porcentajeAsistencia: resultado.registro.porcentajeAsistenciaActual?.toString(),
          clasesAsistidas: resultado.registro.clasesAsistidas?.toString(),
          totalClases: resultado.registro.totalClases?.toString(),
          cumpleMinimoAsistencia: resultado.registro.cumpleMinimoAsistencia ? "true" : "false",
          idCurso: datosQR.idCurso?.toString()
        }
      });
    } catch (error: any) {
      console.error("❌ Error en el proceso de QR:", error);
      Alert.alert("Error", error.message || "Ocurrió un error al procesar el código QR");
    } finally {
      setProcessing(false);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
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
            Escáner QR No Disponible
          </Title>
          <Text style={styles.webMessage}>
            El escáner QR solo está disponible en dispositivos móviles (Android/iOS).
            {"\n\n"}
            Por favor, utiliza la aplicación móvil para escanear códigos QR.
          </Text>
        </Column>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        <ExpoQRScanner
          onQRScanned={handleQRScanned}
          onError={(error) => {
            Alert.alert("Error", error);
          }}
        />
        {processing && (
          <Text style={styles.processingText}>
            🔄 Procesando asistencia...
          </Text>
        )}
      </Column>
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
  cameraContainer: {
    width: 300,
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
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
  permissionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionButton: {
    backgroundColor: primary,
    marginTop: 10,
  },
  resetButton: {
    backgroundColor: primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  processingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#007AFF",
    fontWeight: "600",
  },
  webMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
  },
});
