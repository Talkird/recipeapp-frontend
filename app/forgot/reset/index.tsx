import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import Input from "@/components/ui/Input";
import { Link, router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { primary } from "@/utils/colors";
import ForgotPasswordIllustration from "@/assets/illustrations/forgot-password.svg";
import { Lock, RefreshCcw } from "lucide-react-native";
import { useState } from "react";
import { useUserStore } from "@/stores/user";

export default function Index() {
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");

  const { actualizarClave } = useUserStore();

  const handleConfirmarClave = () => {
    if (!nuevaClave || !confirmarClave) {
      alert("Por favor, completa ambos campos.");
      return;
    }

    if (nuevaClave !== confirmarClave) {
      alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
      return;
    }

    actualizarClave(nuevaClave, confirmarClave)
      .then(() => {
        router.push("/forgot/success");
      })
      .catch((error) => {
        console.error("Error al actualizar la contraseña:", error);
        alert(
          "Ocurrió un error al actualizar la contraseña. Inténtalo de nuevo más tarde."
        );
      });
  };

  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Title style={{ width: "50%" }}>Restablecer contraseña</Title>

      <ForgotPasswordIllustration width={205} height={135} />
      <Input
        onChangeText={setNuevaClave}
        value={nuevaClave}
        Icon={Lock}
        placeholder="Nueva contraseña"
      />
      <Input
        onChangeText={setConfirmarClave}
        value={confirmarClave}
        Icon={RefreshCcw}
        placeholder="Confirmar contraseña"
      />

      <Button onPress={handleConfirmarClave}>Finalizar</Button>
    </Column>
  );
}
