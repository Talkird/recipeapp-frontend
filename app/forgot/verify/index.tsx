import { Column } from "@/components/ui/Column";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { router } from "expo-router";
import ForgotPasswordIllustration from "@/assets/illustrations/forgot-password.svg";
import { CodeInput } from "@/components/CodeInput";
import { useState } from "react";
import { useUserStore } from "@/stores/user";

export default function Index() {
  const [value, setValue] = useState("");
  const { validarCodigoRecuperacion } = useUserStore();
  const { mail } = useUserStore.getState();

  const handleVerifyCode = () => {
    if (value.length !== 6) {
      alert("El código debe tener 6 dígitos.");
      return;
    }
    if (!mail) {
      alert("No se encontró un correo electrónico válido.");
      return;
    }
    validarCodigoRecuperacion(mail, value)
      .then(() => {
        router.push("/forgot/reset");
      })
      .catch((error) => {
        console.error("Error al validar el código:", error);
        alert("Código inválido. Por favor, inténtalo de nuevo.");
      });
  };

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

      <Button style={{ marginBottom: 10 }} onPress={handleVerifyCode}>
        Restablecer
      </Button>
    </Column>
  );
}
