import { ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { BadgeEuro, Clock, Phone } from "lucide-react-native";
import Label from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/stores/user";
import { useCursoStore, CursoDetalleDTO } from "@/stores/courses";
import { API_URLS } from "@/lib/constants";

export default function CursoDetail() {
  const { id } = useLocalSearchParams();
  const [curso, setCurso] = useState<CursoDetalleDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [inscribiendose, setInscribiendose] = useState(false);
  const [yaInscripto, setYaInscripto] = useState(false);
  const getAlumnoId = useUserStore((state) => state.getAlumnoId);
  const isGuest = useUserStore((state) => state.isGuest);
  const { fetchCursoDetalle, crearInscripcion } = useCursoStore();

  // Redirect guests to login
  useEffect(() => {
    if (isGuest) {
      Alert.alert(
        "Acceso Restringido",
        "Para acceder a los cursos necesás iniciar sesión o crear una cuenta.",
        [
          {
            text: "Iniciar Sesión",
            onPress: () => {
              useUserStore.getState().setGuestMode(false);
              router.replace("/login");
            },
          },
          {
            text: "Volver",
            onPress: () => router.back(),
            style: "cancel",
          },
        ]
      );
      return;
    }
  }, [isGuest]);

  useEffect(() => {
    async function fetchData() {
      if (!id || isGuest) return; // Don't fetch data for guests
      setLoading(true);
      try {
        // Usar el nuevo método fetchCursoDetalle que trae toda la información en una sola llamada
        const cursoDetalle = await fetchCursoDetalle(parseInt(id as string));
        if (cursoDetalle) {
          setCurso(cursoDetalle);
        }

        // Verificar si el alumno ya está inscrito en este curso
        const alumnoId = await getAlumnoId();
        if (alumnoId) {
          try {
            const inscripcionesRes = await axios.get(
              `http://localhost:8080/api/inscripciones/alumno/${alumnoId}`
            );
            const inscripciones = inscripcionesRes.data;
            const yaEstaInscrito = inscripciones.some(
              (inscripcion: any) =>
                inscripcion.cronograma.curso.idCurso === parseInt(id as string)
            );
            setYaInscripto(yaEstaInscrito);
          } catch (error) {
            console.error("Error al verificar inscripción:", error);
          }
        }
      } catch (e) {
        console.error("Error al obtener detalle del curso:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, fetchCursoDetalle, getAlumnoId, isGuest]);

  // Actualizar datos cada vez que el usuario regresa a esta pantalla
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        if (!id || isGuest) return; // Don't fetch data for guests
        setLoading(true);
        try {
          // Usar el nuevo método fetchCursoDetalle que trae toda la información en una sola llamada
          const cursoDetalle = await fetchCursoDetalle(parseInt(id as string));
          if (cursoDetalle) {
            setCurso(cursoDetalle);
          }

          // Verificar si el alumno ya está inscrito en este curso
          const alumnoId = await getAlumnoId();
          if (alumnoId) {
            try {
              const inscripcionesRes = await axios.get(
                `http://localhost:8080/api/inscripciones/alumno/${alumnoId}`
              );
              const inscripciones = inscripcionesRes.data;
              const yaEstaInscrito = inscripciones.some(
                (inscripcion: any) =>
                  inscripcion.cronograma.curso.idCurso ===
                  parseInt(id as string)
              );
              setYaInscripto(yaEstaInscrito);
            } catch (error) {
              console.error("Error al verificar inscripción:", error);
            }
          }
        } catch (e) {
          console.error("Error al obtener detalle del curso:", e);
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }, [id, fetchCursoDetalle, getAlumnoId, isGuest])
  );

  const handleInscribirse = async () => {
    try {
      setInscribiendose(true);

      // Obtener el ID del alumno
      const alumnoId = await getAlumnoId();
      if (!alumnoId) {
        Alert.alert("Error", "No se pudo obtener la información del alumno");
        return;
      }

      // Obtener el ID del cronograma (usar el primer cronograma disponible)
      if (
        !curso ||
        !curso.cronogramasDisponibles ||
        curso.cronogramasDisponibles.length === 0
      ) {
        Alert.alert("Error", "No hay cronogramas disponibles para este curso");
        return;
      }

      const idCronograma = curso.cronogramasDisponibles[0].idCronograma;

      // Usar el nuevo método del store
      const inscripcionResponse = await crearInscripcion({
        idAlumno: alumnoId,
        idCronograma: idCronograma,
      });

      if (inscripcionResponse.exitosa) {
        // Mostrar información detallada del pago
        let metodoPagoDetalle = "";
        switch (inscripcionResponse.metodoPago) {
          case "CUENTA_CORRIENTE":
            metodoPagoDetalle = `Saldo utilizado: $${inscripcionResponse.saldoUtilizado}`;
            break;
          case "TARJETA":
            metodoPagoDetalle = `Tarjeta: ****${
              inscripcionResponse.numeroTarjeta || "XXXX"
            }`;
            break;
          case "MIXTO":
            metodoPagoDetalle = `Saldo: $${inscripcionResponse.saldoUtilizado} + Tarjeta: $${inscripcionResponse.montoTarjeta}`;
            break;
          default:
            metodoPagoDetalle = `Método: ${inscripcionResponse.metodoPago}`;
        }

        const mensaje = `¡Inscripción exitosa!

Curso: ${inscripcionResponse.nombreCurso}
Precio: $${inscripcionResponse.precioCurso}
${metodoPagoDetalle}
Saldo restante: $${inscripcionResponse.saldoRestante}

${inscripcionResponse.mensaje}`;

        Alert.alert("¡Éxito!", mensaje);
        setYaInscripto(true);

        // Actualizar los cupos disponibles
        setCurso((prev) =>
          prev
            ? {
                ...prev,
                cronogramasDisponibles: prev.cronogramasDisponibles.map(
                  (cronograma) =>
                    cronograma.idCronograma === idCronograma
                      ? {
                          ...cronograma,
                          vacantesDisponibles:
                            cronograma.vacantesDisponibles - 1,
                        }
                      : cronograma
                ),
              }
            : prev
        );
      } else {
        Alert.alert(
          "Error",
          inscripcionResponse.mensaje || "La inscripción no pudo completarse"
        );
      }
    } catch (error: any) {
      console.error("Error al inscribirse:", error);

      if (error.response?.status === 400) {
        Alert.alert(
          "Error",
          "Ya estás inscripto en este curso o no hay cupos disponibles"
        );
      } else if (error.response?.status === 404) {
        Alert.alert("Error", "El curso o cronograma no existe");
      } else {
        Alert.alert(
          "Error",
          "Ocurrió un error al inscribirse. Por favor, intenta nuevamente"
        );
      }
    } finally {
      setInscribiendose(false);
    }
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

        <SubTitle>{curso.contenidos}</SubTitle>

        <Column style={{ gap: 32 }}>
          <SubTitle>Información del curso</SubTitle>
          <Label Icon={BadgeEuro} text={`Precio: $${curso.precio}`} />
          <Label Icon={Clock} text={`Duración: ${curso.duracion}`} />
          <Label Icon={Clock} text={`Modalidad: ${curso.modalidad}`} />
          {curso.requerimientos && (
            <SmallText>Requerimientos: {curso.requerimientos}</SmallText>
          )}
          {curso.tienePromocion && curso.promocionDescripcion && (
            <SmallText style={{ color: "red", fontWeight: "bold" }}>
              🔥 {curso.promocionDescripcion}
            </SmallText>
          )}
        </Column>

        {/* Información de cronogramas */}
        {curso.cronogramasDisponibles &&
          curso.cronogramasDisponibles.length > 0 && (
            <Column
              style={{
                gap: 12,
                alignItems: "center",
                width: "100%",
              }}
            >
              <SubTitle>
                Cupos restantes:{" "}
                {curso.cronogramasDisponibles[0].vacantesDisponibles}
              </SubTitle>
              <Label
                Icon={Clock}
                text={`Inicio: ${curso.cronogramasDisponibles[0].fechaInicio}`}
              />
              <Label
                Icon={Clock}
                text={`Fin: ${curso.cronogramasDisponibles[0].fechaFin}`}
              />
              <SmallText>
                Sede: {curso.cronogramasDisponibles[0].nombreSede}
              </SmallText>
              <SmallText>
                Dirección: {curso.cronogramasDisponibles[0].direccionSede}
              </SmallText>
              <Button
                onPress={handleInscribirse}
                disabled={
                  inscribiendose ||
                  yaInscripto ||
                  curso.cronogramasDisponibles[0].vacantesDisponibles <= 0
                }
              >
                {inscribiendose
                  ? "Inscribiendo..."
                  : yaInscripto
                  ? "Ya inscripto"
                  : curso.cronogramasDisponibles[0].vacantesDisponibles <= 0
                  ? "Sin cupos"
                  : "Inscribirse"}
              </Button>
            </Column>
          )}
      </Column>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ...add custom styles if needed...
});
