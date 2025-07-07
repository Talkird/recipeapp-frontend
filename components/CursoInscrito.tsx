import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { StyleSheet } from "react-native";
import { SubTitle } from "./ui/SubTitle";
import { SmallText } from "./ui/SmallText";
import { CursoInscritoDTO, useCursoStore } from "@/stores/courses";
import { primary } from "@/utils/colors";
import { ChefHat } from "lucide-react-native";

interface CursoInscritoProps {
  curso: CursoInscritoDTO;
}

const CursoInscrito = ({ curso }: CursoInscritoProps) => {
  const router = useRouter();
  const [descripcionDetallada, setDescripcionDetallada] = useState<string>("");
  const { fetchCursoDetalle } = useCursoStore();

  useEffect(() => {
    const obtenerDescripcion = async () => {
      try {
        const cursoDetalle = await fetchCursoDetalle(curso.idCurso);
        if (cursoDetalle && cursoDetalle.contenidos) {
          // Truncar la descripción para que no sea muy larga
          const descripcionCorta =
            cursoDetalle.contenidos.length > 100
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

  // Trim description to 20 characters
  const trimmedDescription =
    descripcionDetallada && descripcionDetallada.length > 20
      ? descripcionDetallada.substring(0, 20) + "..."
      : descripcionDetallada;

  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
      style={{ width: "95%", alignSelf: "center" }}
    >
      <Row style={styles.container}>
        {/* Icon Section */}
        <View style={styles.iconContainer}>
          <ChefHat size={40} color={primary} />
        </View>

        {/* Content Section */}
        <Column
          style={{
            gap: 2,
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flex: 1,
            paddingLeft: 12,
          }}
        >
          <SubTitle>{curso.descripcion}</SubTitle>
          {trimmedDescription && (
            <SmallText
              style={{
                textAlign: "left",
                color: "#666",
              }}
            >
              {trimmedDescription}
            </SmallText>
          )}
        </Column>

        {/* Badge "En proceso" */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>EN PROCESO</Text>
        </View>
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100, // Increased height to accommodate better description visibility
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    backgroundColor: "#FFFFFF",
  },
  iconContainer: {
    width: 80,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
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
