import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { SubTitle } from "./ui/SubTitle";
import { SmallText } from "./ui/SmallText";
import { CursoInscritoDTO, useCursoStore } from "@/stores/courses";
import { primary } from "@/utils/colors";

interface CursoInscritoProps {
  curso: CursoInscritoDTO;
  imageUrl: string;
}

const CursoInscrito = ({ curso, imageUrl }: CursoInscritoProps) => {
  const router = useRouter();
  const [descripcionDetallada, setDescripcionDetallada] = useState<string>("");
  const { fetchCursoDetalle } = useCursoStore();
  
  useEffect(() => {
    const obtenerDescripcion = async () => {
      try {
        const cursoDetalle = await fetchCursoDetalle(curso.idCurso);
        if (cursoDetalle && cursoDetalle.contenidos) {
          // Truncar la descripción para que no sea muy larga
          const descripcionCorta = cursoDetalle.contenidos.length > 100 
            ? cursoDetalle.contenidos.substring(0, 100) + "..."
            : cursoDetalle.contenidos;
          setDescripcionDetallada(descripcionCorta);
        }
      } catch (error) {
        console.error("Error al obtener descripción del curso:", error);
      }
    };
    
    obtenerDescripcion();
  }, [curso.idCurso]);
  
  const handleClick = () => {
    router.push(`/courses/course/inscrito/${curso.idCurso}`);
  };

  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
      style={{ width: "80%" }}
    >
      <Row style={styles.container}>
        <Row style={{ gap: 12 }}>
          <Image style={styles.image} source={imageUrl} />
          <Column
            style={{
              gap: 2,
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <SubTitle>{curso.descripcion}</SubTitle>
            {descripcionDetallada && (
              <SmallText
                style={{
                  width: "80%",
                  textAlign: "left",
                }}
              >
                {descripcionDetallada}
              </SmallText>
            )}
          </Column>
        </Row>
        {/* Badge "En proceso" */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            EN PROCESO
          </Text>
        </View>
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: 75,
    borderRadius: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    flexDirection: "row",

    justifyContent: "space-between",
    padding: 0,

    backgroundColor: "#FFFFFF",
  },
  image: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: 75,
    height: 75,
    alignSelf: "flex-start",
    marginLeft: 0,
    marginRight: 0,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "center",
    marginRight: 12,
    backgroundColor: primary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
  },
});

export default CursoInscrito;
