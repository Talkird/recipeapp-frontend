import React, { useEffect, useState } from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import SearchBar from "@/components/RecipeSearchBar";
import Course from "@/components/Course";
import CursoInscrito from "@/components/CursoInscrito";
import { useCursoStore } from "@/stores/courses";
import { Row } from "@/components/ui/Row";
import { useUserStore } from "@/stores/user";
import { Button, View } from "react-native";
import { primary } from "@/utils/colors";
import CoursesSearchBar from "@/components/ui/CoursesSearchBar";
import { useFocusEffect } from "@react-navigation/native";

export default function Index() {
  const [tab, setTab] = useState<"available" | "mine">("available");
  const [loading, setLoading] = useState(false);
  const refreshAlumnoId = useUserStore((state) => state.refreshAlumnoId);
  const alumnoId = useUserStore((state) => state.alumnoId);

  // Usar los nuevos métodos del store para ambos tipos de cursos
  const {
    cursosDisponibles,
    cursosInscritos,
    fetchCursosDisponiblesParaAlumno,
    fetchCursosInscritosParaAlumno,
  } = useCursoStore();

  useEffect(() => {
    // Intentar obtener el alumnoId al cargar el componente
    refreshAlumnoId();
  }, []);

  // Refrescar el alumnoId cuando la pantalla se enfoque
  useFocusEffect(
    React.useCallback(() => {
      refreshAlumnoId();
    }, [])
  );

  // Función para obtener cursos disponibles usando el nuevo endpoint
  const fetchCursosDisponibles = async () => {
    if (!alumnoId) return;

    setLoading(true);
    try {
      // Usar el nuevo método del store que llama al endpoint optimizado
      await fetchCursosDisponiblesParaAlumno(alumnoId);
      console.log("Cursos disponibles obtenidos del nuevo endpoint");
    } catch (error) {
      console.error("Error al obtener cursos disponibles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener cursos inscritos usando el nuevo endpoint
  const fetchMisCursos = async () => {
    if (!alumnoId) return;

    setLoading(true);
    try {
      // Usar el nuevo método del store que llama al endpoint optimizado
      await fetchCursosInscritosParaAlumno(alumnoId);
      console.log("Cursos inscritos obtenidos del nuevo endpoint");
    } catch (error) {
      console.error("Error al obtener cursos inscritos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos cuando cambia la tab o el alumnoId
  useEffect(() => {
    console.log("useEffect ejecutado - tab:", tab, "alumnoId:", alumnoId);

    if (!alumnoId) {
      console.log(
        "No hay alumnoId, no se pueden cargar cursos. alumnoId actual:",
        alumnoId
      );
      return;
    }

    console.log("AlumnoId válido encontrado:", alumnoId);

    // Función para cargar los datos apropiados según la tab
    const loadData = async () => {
      if (tab === "available") {
        console.log("Cargando cursos disponibles...");
        await fetchCursosDisponibles();
      } else {
        console.log("Cargando mis cursos...");
        await fetchMisCursos();
      }
    };

    // Cargar datos inmediatamente
    loadData();

    // Si estamos en la tab de disponibles, configurar polling para actualización automática
    let intervalId: NodeJS.Timeout | null = null;

    if (tab === "available") {
      // Actualizar cada 30 segundos
      intervalId = setInterval(() => {
        console.log("Actualizando cursos disponibles automáticamente...");
        fetchCursosDisponibles();
      }, 30000);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [tab, alumnoId]);

  return (
    <Column
      style={{
        flex: 1,
        gap: 32,
        justifyContent: "flex-start",
        marginTop: 32,
      }}
    >
      <Title>Cursos</Title>
      <Row style={{ gap: 12, marginBottom: 8 }}>
        <Button
          title="Disponibles"
          onPress={() => setTab("available")}
          color={tab === "available" ? primary : "#ccc"}
        />
        <Button
          title="Mis cursos"
          onPress={() => setTab("mine")}
          color={tab === "mine" ? primary : "#ccc"}
        />
      </Row>
      <CoursesSearchBar />
      {tab === "available" &&
        cursosDisponibles.map((curso) => (
          <Course
            key={curso.idCurso}
            id={curso.idCurso}
            title={curso.descripcion}
            imageUrl={
              curso.imagenPortada ||
              "https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVhdHxlbnwwfHwwfHx8MA%3D%3D"
            }
            state={curso.tieneVacantes ? "active" : "inactive"}
          />
        ))}

      {tab === "mine" &&
        (loading ? (
          <Title>Cargando tus cursos...</Title>
        ) : cursosInscritos.length > 0 ? (
          cursosInscritos.map((curso) => (
            <CursoInscrito
              key={curso.idInscripcion}
              curso={curso}
              imageUrl="https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVhdHxlbnwwfHwwfHx8MA%3D%3D"
            />
          ))
        ) : (
          <Title>No estás inscripto en ningún curso.</Title>
        ))}
    </Column>
  );
}
