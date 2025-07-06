import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { SubTitle } from "./ui/SubTitle";
import { SmallText } from "./ui/SmallText";
import { CursoInscritoDTO } from "@/stores/courses";

interface CursoInscritoProps {
  curso: CursoInscritoDTO;
  imageUrl: string;
}

const CursoInscrito = ({ curso, imageUrl }: CursoInscritoProps) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/courses/course/${curso.idCurso}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleClick}>
      <Row style={{ gap: 12, alignItems: "center" }}>
        <Image style={styles.image} source={imageUrl} />
        
        <Column style={{ flex: 1, gap: 4 }}>
          <SubTitle style={{ fontSize: 18 }}>{curso.descripcion}</SubTitle>
          <SmallText>{curso.modalidad} • {curso.duracion} • $${curso.precio}</SmallText>
          <SmallText>Estado: {curso.estadoInscripcion}</SmallText>
          <SmallText>Sede: {curso.nombreSede}</SmallText>
          <SmallText>Asistencia: {curso.porcentajeAsistencia}% ({curso.clasesAsistidas}/{curso.totalClases})</SmallText>
          {curso.fechaInicio && (
            <SmallText>Inicio: {curso.fechaInicio}</SmallText>
          )}
        </Column>
        

      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default CursoInscrito;
