import { ScrollView } from "react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { BadgeEuro, Clock, Phone } from "lucide-react-native";
import Label from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export default function CursoPlaceholder() {
  return (
    <ScrollView style={{ marginBottom: 32 }}>
      <Image
        source={
          "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVhdHxlbnwwfHwwfHx8MA%3D%3D"
        }
        style={{ width: "100%", height: 250 }}
      />

      <Column style={{ padding: 16, gap: 32 }}>
        <Title>Curso de Carnes</Title>

        <SubTitle>
          Dominá cortes y técnicas para cocinar carnes con sabor y precisión.
          Aprendé a seleccionar los mejores cortes, marinarlos y cocinarlos a la
          perfección. Ideal para quienes buscan llevar sus habilidades al
          siguiente nivel.
        </SubTitle>

        <Column style={{ gap: 32 }}>
          <SubTitle>Información del curso</SubTitle>
          <Label Icon={Phone} text={`Teléfono: +54 9 11 1234 5678`} />
          <Label Icon={BadgeEuro} text="Precio: 36.799$" />
          <Label Icon={Clock} text="Horario: Lunes 19hs" />
        </Column>

        <Column
          style={{
            gap: 24,
            alignItems: "center",
            width: "100%",
            marginVertical: 16,
          }}
        >
          <SubTitle>Temas</SubTitle>
          <SmallText style={{ textAlign: "left" }}>
            • Selección de cortes de carne
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            • Técnicas de marinado y condimentado
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            • Métodos de cocción: parrilla, horno y sartén
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            • Puntos de cocción y presentación
          </SmallText>

          <SubTitle style={{ marginTop: 16 }}>Prácticas</SubTitle>
          <SmallText style={{ textAlign: "left" }}>
            • Desposte básico y preparación de cortes
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            • Marinados y sellado de carnes
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            • Cocción de diferentes tipos de carne
          </SmallText>

          <SubTitle style={{ marginTop: 16 }}>Utensilios necesarios</SubTitle>
          <SmallText style={{ textAlign: "left" }}>
            • Cuchillo de chef afilado
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>• Tabla de cortar</SmallText>
          <SmallText style={{ textAlign: "left" }}>
            • Pinzas para carne
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            • Parrilla, sartén y/o fuente para horno
          </SmallText>
        </Column>

        <Column
          style={{
            gap: 12,
            alignItems: "center",
            width: "100%",
          }}
        >
          <SubTitle>Cupos restantes: 27</SubTitle>
          <Button>Inscribirse</Button>
        </Column>
      </Column>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ...add custom styles if needed...
});
