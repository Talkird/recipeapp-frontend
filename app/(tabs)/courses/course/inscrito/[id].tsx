import { ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BadgeEuro, Clock, Users, TrendingUp, QrCode } from "lucide-react-native";
import Label from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/stores/user";
import { useCursoStore, CursoInscritoDTO } from "@/stores/courses";
import { primary } from "@/utils/colors";

export default function CursoInscritoDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [curso, setCurso] = useState<CursoInscritoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [dandoDeBaja, setDandoDeBaja] = useState(false);
  const getAlumnoId = useUserStore((state) => state.getAlumnoId);
  const { isAlumno } = useUserStore();
  const { cursosInscritos, fetchCursosInscritosParaAlumno, cancelarInscripcion } = useCursoStore();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      // VERIFICAR SI EL USUARIO ES ALUMNO ANTES DE MOSTRAR EL CURSO INSCRITO
      // Si no es alumno, redirigir a la página de registro de alumno
      const esAlumno = await isAlumno();
      
      if (!esAlumno) {
        console.log("Usuario no es alumno, redirigiendo a registro de alumno");
        router.replace("/becomestudent");
        return;
      }
      
      setLoading(true);
      try {
        // Buscar el curso en la lista de cursos inscritos
        const cursoEncontrado = cursosInscritos.find(
          (c) => c.idCurso === parseInt(id as string)
        );
        
        if (cursoEncontrado) {
          setCurso(cursoEncontrado);
        } else {
          // Si no está en la lista, recargar los cursos inscritos
          const alumnoId = await getAlumnoId();
          if (alumnoId) {
            await fetchCursosInscritosParaAlumno(alumnoId);
            // Buscar nuevamente después de recargar
            const cursoActualizado = cursosInscritos.find(
              (c) => c.idCurso === parseInt(id as string)
            );
            setCurso(cursoActualizado || null);
          }
        }
      } catch (e) {
        console.error("Error al obtener detalle del curso inscrito:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, cursosInscritos]);

  const handleDarseDeBaja = async () => {
    if (!curso) return;

    Alert.alert(
      "Confirmar baja",
      `¿Estás seguro de que quieres darte de baja del curso "${curso.descripcion}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            try {
              setDandoDeBaja(true);
              
              const alumnoId = await getAlumnoId();
              if (!alumnoId) {
                Alert.alert("Error", "No se pudo obtener la información del alumno");
                return;
              }

              const response = await cancelarInscripcion(curso.idInscripcion, alumnoId);

              if (response.exitosa) {
                const mensaje = `Baja procesada exitosamente

Curso: ${response.nombreCurso}
Precio original: $${response.precioOriginal}
Reintegro: $${response.montoReintegro} (${response.porcentajeReintegro}%)
Saldo actual: $${response.saldoActual}

${response.mensaje}`;

                Alert.alert("¡Baja exitosa!", mensaje, [
                  {
                    text: "OK",
                    onPress: () => {
                      // Recargar la lista de cursos inscritos y volver atrás
                      fetchCursosInscritosParaAlumno(alumnoId);
                      router.back();
                    }
                  }
                ]);
              } else {
                Alert.alert("Error", response.mensaje || "No se pudo procesar la baja");
              }
            } catch (error: any) {
              console.error("Error al darse de baja:", error);
              
              if (error.response?.status === 400) {
                Alert.alert("Error", "No se puede dar de baja en este momento");
              } else if (error.response?.status === 404) {
                Alert.alert("Error", "La inscripción no existe o ya fue cancelada");
              } else {
                Alert.alert("Error", "Ocurrió un error al procesar la baja. Por favor, intenta nuevamente");
              }
            } finally {
              setDandoDeBaja(false);
            }
          }
        }
      ]
    );
  };

  const handleEscanearQR = () => {
    // Navegar a la página de escaneo QR pasando el ID del curso
    router.push(`/QR?courseId=${curso?.idCurso}`);
  };

  if (loading || !curso) {
    return <SmallText>Cargando...</SmallText>;
  }

  return (
    <ScrollView style={{ marginBottom: 32 }}>
      <Image
        source={
          "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVhdHxlbnwwfHwwfHx8MA%3D%3D"
        }
        style={{ width: "100%", height: 250 }}
      />

      <Column style={{ padding: 16, gap: 32 }}>
        <Title>{curso.descripcion}</Title>

        <Column style={{ gap: 32 }}>
          <SubTitle>Información del curso</SubTitle>
          <Label Icon={BadgeEuro} text={`Precio: $${curso.precio}`} />
          <Label Icon={Clock} text={`Duración: ${curso.duracion}`} />
          <Label Icon={Clock} text={`Modalidad: ${curso.modalidad}`} />
          <Label Icon={Users} text={`Sede: ${curso.nombreSede}`} />
          <SmallText>Dirección: {curso.direccionSede}</SmallText>
        </Column>

        {/* Información de fechas */}
        <Column style={{ gap: 12 }}>
          <SubTitle>Fechas del curso</SubTitle>
          <Label Icon={Clock} text={`Inicio: ${curso.fechaInicio}`} />
          <Label Icon={Clock} text={`Fin: ${curso.fechaFin}`} />
          <SmallText>Fecha de inscripción: {curso.fechaInscripcion}</SmallText>
        </Column>

        {/* Información de asistencia */}
        <Column
          style={{
            gap: 12,
            alignItems: "center",
            width: "100%",
          }}
        >
          <SubTitle>Asistencia</SubTitle>
          <Label
            Icon={TrendingUp}
            text={`Porcentaje: ${curso.porcentajeAsistencia}%`}
          />
          <Label
            Icon={Users}
            text={`Clases: ${curso.clasesAsistidas} / ${curso.totalClases}`}
          />
          <SmallText>Estado: {curso.estadoInscripcion}</SmallText>
          
          {curso.completado && curso.fechaCompletacion && (
            <SmallText style={{ color: 'green', fontWeight: 'bold' }}>
              ✅ Curso completado el {curso.fechaCompletacion}
            </SmallText>
          )}
          
          {curso.puedeEscanearQR && (
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <SmallText style={{ color: 'blue' }}>
                📱 Puedes registrar asistencia por QR
              </SmallText>
              <TouchableOpacity 
                onPress={handleEscanearQR}
                style={styles.qrButton}
              >
                <QrCode size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          )}

          {/* Botón de darse de baja */}
          {curso.estadoInscripcion === 'ACTIVA' && (
            <Button 
              onPress={handleDarseDeBaja}
              disabled={dandoDeBaja}
              style={{ backgroundColor: primary }}
            >
              {dandoDeBaja ? "Procesando baja..." : "Darse de baja"}
            </Button>
          )}
          
          {curso.estadoInscripcion !== 'ACTIVA' && (
            <SmallText style={{ color: 'gray', fontStyle: 'italic' }}>
              {curso.estadoInscripcion === 'FINALIZADA' 
                ? 'Curso finalizado' 
                : 'Inscripción cancelada'}
            </SmallText>
          )}
        </Column>
      </Column>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  qrButton: {
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
