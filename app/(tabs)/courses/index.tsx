import React, { useEffect, useState } from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import SearchBar from "@/components/RecipeSearchBar";
import Course from "@/components/Course";
import { useCursoStore } from "@/stores/courses";
import { Row } from "@/components/ui/Row";
import { useUserStore } from "@/stores/user";
import { Button, View } from "react-native";
import { primary } from "@/utils/colors";
import CoursesSearchBar from "@/components/ui/CoursesSearchBar";

export default function Index() {
  const cursos = useCursoStore((state) => state.cursos);
  const fetchCursos = useCursoStore((state) => state.fetchCursos);
  const [tab, setTab] = useState<"all" | "mine">("all");
  const [misCursos, setMisCursos] = useState<any[]>([]);
  const [loadingMisCursos, setLoadingMisCursos] = useState(false);
  const getAlumnoId = useUserStore((state) => state.getAlumnoId);
  const [alumnoId, setAlumnoId] = useState<number | null>(null);

  useEffect(() => {
    if (tab === "all") {
      fetchCursos();
    }
  }, [tab]);

  useEffect(() => {
    getAlumnoId().then(setAlumnoId);
  }, []);

  useEffect(() => {
    if (tab === "mine" && alumnoId) {
      setLoadingMisCursos(true);
      fetch(`http://localhost:8080/api/cursos/alumno/${alumnoId}/inscritos`)
        .then((res) => res.json())
        .then((data) => setMisCursos(data))
        .finally(() => setLoadingMisCursos(false));
    }
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
          onPress={() => setTab("all")}
          color={tab === "all" ? primary : "#ccc"}
        />
        <Button
          title="Mis cursos"
          onPress={() => setTab("mine")}
          color={tab === "mine" ? primary : "#ccc"}
        />
      </Row>
      <CoursesSearchBar />
      {tab === "all" &&
        cursos.map((curso) => (
          <Course
            key={curso.idCurso}
            id={curso.idCurso}
            title={curso.descripcion}
            description={curso.contenidos}
            imageUrl={
              "https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVhdHxlbnwwfHwwfHx8MA%3D%3D"
            }
            state={"active"}
          />
        ))}
      {tab === "mine" &&
        (loadingMisCursos ? (
          <Title>Cargando tus cursos...</Title>
        ) : misCursos.length > 0 ? (
          misCursos.map((curso) => (
            <Course
              key={curso.idCurso}
              id={curso.idCurso}
              title={curso.descripcion}
              description={curso.contenidos}
              imageUrl={
                "https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVhdHxlbnwwfHwwfHx8MA%3D%3D"
              }
              state={"active"}
            />
          ))
        ) : (
          <Title>No estás inscripto en ningún curso.</Title>
        ))}
    </Column>
  );
}
