import { Column } from "@/components/ui/Column";
import { Row } from "@/components/ui/Row";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { View, Text } from "react-native";
import { router } from "expo-router";
import AvatarIllustration from "@/assets/illustrations/avatar.svg";

const numbers = [1, 2, 3, 4, 5, 6];

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Crea tu cuenta</Title>
        <SubTitle>Y empezá a cocinar</SubTitle>
      </Column>

      <AvatarIllustration height={135} width={135} />

      <SubTitle style={{ width: "75%", textAlign: "center" }}>
        Se envió un código de verificación a example@mail.com. Por favor,
        ingresalo a continuación para finalizar la registración:
      </SubTitle>

      <Column style={{ gap: 20 }}>
        <Row style={{ gap: 10 }}>
          {numbers.map((number) => (
            <View
              style={{
                width: 50,
                height: 65,
                borderRadius: 8,
                backgroundColor: "#D9D9D9",
                justifyContent: "center",
                alignContent: "center",
              }}
              key={number}
            >
              <SubTitle style={{ fontSize: 24 }}>{number}</SubTitle>
            </View>
          ))}
        </Row>
      </Column>

      <Button
        style={{ marginBottom: 10 }}
        onPress={() => router.push("/register/verify/success")}
      >
        Verificar
      </Button>
    </Column>
  );
}
