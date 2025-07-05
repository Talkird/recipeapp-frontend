import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

export default function CursoDetail() {
  const { id } = useLocalSearchParams();
  const [curso, setCurso] = useState<any>(null);
  const [cronogramas, setCronogramas] = useState<any[]>([]);
  const [telefonoSede, setTelefonoSede] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const cursoRes = await axios.get(
          `http://localhost:8080/api/cursos/${id}`
        );
        setCurso(cursoRes.data);

        const cronoRes = await axios.get(
          `http://localhost:8080/cronogramas/curso/${id}`
        );
        setCronogramas(cronoRes.data);

        if (
          cronoRes.data &&
          cronoRes.data.length > 0 &&
          cronoRes.data[0].sede?.telefonoSede
        ) {
          setTelefonoSede(cronoRes.data[0].sede.whatsapp);
        }
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

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
          <Label
            Icon={Phone}
            text={`Teléfono: ${telefonoSede || "No disponible"}`}
          />
          <Label Icon={BadgeEuro} text={`Precio: ${curso.precio}$`} />
          <Label Icon={Clock} text={`Duración: ${curso.duracion}`} />
        </Column>

        {/* Temas, prácticas, utensilios, etc. can be rendered from curso if available */}

        {cronogramas.length > 0 && (
          <Column
            style={{
              gap: 12,
              alignItems: "center",
              width: "100%",
            }}
          >
            <SubTitle>
              Cupos restantes: {cronogramas[0].vacantesDisponibles}
            </SubTitle>
            <Label
              Icon={Clock}
              text={`Inicio: ${cronogramas[0].fechaInicio}`}
            />
            <Label Icon={Clock} text={`Fin: ${cronogramas[0].fechaFin}`} />
            <Button>Inscribirse</Button>
          </Column>
        )}
      </Column>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ...add custom styles if needed...
});
