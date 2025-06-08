import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import Input from "@/components/ui/Input";
import { Link, router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { primary } from "@/utils/colors";
import AvatarIllustration from "@/assets/illustrations/avatar.svg";
import { Lock, RefreshCcw } from "lucide-react-native";
import { useState } from "react";
import { useUserStore } from "@/stores/user";

export default function Index() {
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const { finalizarRegistro } = useUserStore();
  const { choiceAlumno } = useUserStore();

  const handleFinalizar = () => {
    if (clave !== confirmarClave) {
      alert("Las contraseñas no coinciden");
      return;
    }

    finalizarRegistro(clave, confirmarClave)
      .then(() => {
        if (choiceAlumno) {
          router.push("/register/alumno");
          return;
        } else {
          router.push("/register/success");
        }
      })
      .catch((error) => {
        console.error("Error al finalizar el registro:", error);
        alert("Error al finalizar el registro. Inténtalo de nuevo.");
      });
  };

  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Title style={{ width: "50%" }}>Creá tu cuenta</Title>

      <AvatarIllustration width={205} height={135} />
      <Input
        onChangeText={setClave}
        value={clave}
        Icon={Lock}
        placeholder="Contraseña"
      />
      <Input
        onChangeText={setConfirmarClave}
        value={confirmarClave}
        Icon={RefreshCcw}
        placeholder="Confirmar contraseña"
      />

      <Button onPress={handleFinalizar}>Finalizar</Button>
    </Column>
  );
}
