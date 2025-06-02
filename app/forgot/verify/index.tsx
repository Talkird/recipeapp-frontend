import { Column } from "@/components/ui/Column";
import { Row } from "@/components/ui/Row";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { router } from "expo-router";
import ForgotPasswordIllustration from "@/assets/illustrations/forgot-password.svg";
import { CodeInput } from "@/components/CodeInput";
import { useState } from "react";

export default function Index() {
  const [value, setValue] = useState("");

  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Title style={{ width: "80%" }}>Restablecer contraseña</Title>

      <ForgotPasswordIllustration width={205} height={135} />
      <SubTitle style={{ width: "75%", textAlign: "center" }}>
        Se envió un código de verificación a example@mail.com. Por favor,
        ingresalo a continuación para restablecer tu contraseña:
      </SubTitle>

      <Column style={{ gap: 20 }}>
        <CodeInput value={value} setValue={setValue} />
      </Column>

      <Button
        style={{ marginBottom: 10 }}
        onPress={() => router.push("/forgot/reset")}
      >
        Restablecer
      </Button>
    </Column>
  );
}
