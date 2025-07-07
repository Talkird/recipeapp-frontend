import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import { SmallText } from "@/components/ui/SmallText";
import { CheckCircle } from "lucide-react-native";
import { primary } from "@/utils/colors";

const QRSuccessPage = () => {
  const params = useLocalSearchParams();
  
  const handleContinuar = () => {
    // Navegar de vuelta al curso específico
    router.replace(`/(tabs)/courses/course/${params.idCurso}`);
  };

  const formatearFecha = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaString;
    }
  };

  return (
    <View style={styles.container}>
      <Column style={styles.content}>
        {/* Ícono de éxito */}
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color="#28a745" />
        </View>
        
        {/* Título principal */}
        <Title style={styles.successTitle}>
          ¡Asistencia Registrada!
        </Title>
        
        {/* Mensaje de confirmación */}
        <SmallText style={styles.successMessage}>
          {params.mensaje || "Tu asistencia ha sido registrada exitosamente"}
        </SmallText>
        
        {/* Información del curso */}
        <View style={styles.infoCard}>
          <Column style={styles.infoContent}>
            <View style={styles.infoRow}>
              <SmallText style={styles.infoLabel}>📚 Curso:</SmallText>
              <SubTitle style={styles.infoValue}>{params.nombreCurso}</SubTitle>
            </View>
            
            <View style={styles.infoRow}>
              <SmallText style={styles.infoLabel}>📍 Sede:</SmallText>
              <SmallText style={styles.infoValue}>{params.nombreSede}</SmallText>
            </View>
            
            <View style={styles.infoRow}>
              <SmallText style={styles.infoLabel}>🕒 Fecha:</SmallText>
              <SmallText style={styles.infoValue}>
                {formatearFecha(params.fechaRegistro as string)}
              </SmallText>
            </View>
          </Column>
        </View>
        
        {/* Progreso de asistencia */}
        <View style={styles.progressCard}>
          <SubTitle style={styles.progressTitle}>Tu Progreso Actual</SubTitle>
          
          <View style={styles.progressInfo}>
            <View style={styles.progressItem}>
              <Title style={styles.progressNumber}>
                {params.porcentajeAsistencia}%
              </Title>
              <SmallText style={styles.progressLabel}>Asistencia</SmallText>
            </View>
            
            <View style={styles.progressItem}>
              <Title style={styles.progressNumber}>
                {params.clasesAsistidas}/{params.totalClases}
              </Title>
              <SmallText style={styles.progressLabel}>Clases</SmallText>
            </View>
          </View>
          
          {/* Barra de progreso visual */}
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${Math.min(Number(params.porcentajeAsistencia) || 0, 100)}%` }
              ]} 
            />
          </View>
          
          {/* Estado de asistencia */}
          <View style={styles.statusContainer}>
            {Number(params.porcentajeAsistencia) >= 75 ? (
              <SmallText style={styles.statusGood}>
                ✅ ¡Excelente! Cumples con el mínimo requerido
              </SmallText>
            ) : (
              <SmallText style={styles.statusWarning}>
                ⚠️ Necesitas más asistencia para cumplir el mínimo (75%)
              </SmallText>
            )}
          </View>
        </View>
        
        {/* Botón para continuar */}
        <Button 
          onPress={handleContinuar} 
          style={styles.continueButton}
          textStyle={styles.continueButtonText}
        >
          Continuar al curso
        </Button>
      </Column>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    textAlign: "center",
    color: "#28a745",
    fontSize: 28,
    fontWeight: "bold",
  },
  successMessage: {
    textAlign: "center",
    color: "#666666",
    fontSize: 16,
    lineHeight: 22,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  infoContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    color: "#666666",
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  progressCard: {
    width: "100%",
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#B3E5FC",
    alignItems: "center",
    gap: 16,
  },
  progressTitle: {
    color: "#0277BD",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  progressItem: {
    alignItems: "center",
    gap: 4,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0277BD",
  },
  progressLabel: {
    color: "#666666",
    fontSize: 12,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 4,
  },
  statusContainer: {
    width: "100%",
  },
  statusGood: {
    color: "#28a745",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  statusWarning: {
    color: "#FFA726",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    marginTop: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default QRSuccessPage;
