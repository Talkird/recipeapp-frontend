import { Column } from "@/components/ui/Column";
import { Row } from "@/components/ui/Row";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

const numbers = [1, 2, 3, 4, 5, 6];

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Title style={{ width: "50%" }}>Restablecer contraseña</Title>

      <Image
        source={require("@/assets/illustrations/forgot-password.svg")}
        style={{ height: 135, width: 135 }}
      />
      <SubTitle style={{ width: "75%", textAlign: "center" }}>
        Se envió un código de verificación a example@mail.com. Por favor,
        ingresalo a continuación para restablecer tu contraseña:
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
              <Text
                style={{ fontSize: 24, fontWeight: 500, textAlign: "center" }}
              >
                {number}
              </Text>
            </View>
          ))}
        </Row>
      </Column>

      <Button style={{ marginBottom: 10 }} onPress={() => router.push("/home")}>
        Restablecer
      </Button>
    </Column>
  );
}
