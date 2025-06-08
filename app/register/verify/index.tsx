import { Column } from "@/components/ui/Column";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { router } from "expo-router";
import AvatarIllustration from "@/assets/illustrations/avatar.svg";
import { CodeInput } from "@/components/CodeInput";
import { useState } from "react";
import { useUserStore } from "@/stores/user";

export default function Index() {
  const [value, setValue] = useState("");
  const { validarCodigoRegistro } = useUserStore();
  const { mail } = useUserStore.getState();

  const handleVerify = () => {
    if (value.length !== 6) {
      alert("El código debe tener 6 dígitos.");
      return;
    }
    if (!mail) {
      alert("No se encontró un correo electrónico válido.");
      return;
    }
    validarCodigoRegistro(mail, value)
      .then(() => {
        router.push("/register/input");
      })
      .catch((error) => {
        console.error("Error al validar el código:", error);

        alert("Código inválido. Por favor, inténtalo de nuevo.");
      });
  };
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Crea tu cuenta</Title>
        <SubTitle>Y empezá a cocinar</SubTitle>
      </Column>

      <AvatarIllustration height={135} width={135} />

      <SubTitle style={{ width: "75%", textAlign: "center" }}>
        Se envió un código de verificación a {mail}. Por favor, ingresalo a
        continuación para finalizar la registración:
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
