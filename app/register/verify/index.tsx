import { Column } from "@/components/ui/Column";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { router } from "expo-router";
import AvatarIllustration from "@/assets/illustrations/avatar.svg";
import { CodeInput } from "@/components/CodeInput";
import { useState } from "react";
import useUserStore from "@/stores/user";

export default function Index() {
  const [value, setValue] = useState("");
  const isAlumno = useUserStore((state) => state.isAlumno);

  const handleVerify = () => {
    if (isAlumno) {
      router.push("/register/alumno");
    } else {
      router.push("/register/success");
    }
  };
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
        <CodeInput value={value} setValue={setValue} />
      </Column>

      <Button style={{ marginBottom: 10 }} onPress={handleVerify}>
        Verificar
      </Button>
    </Column>
  );
}
