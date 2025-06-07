import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Link, router } from "expo-router";
import { primary } from "@/utils/colors";
import { SmallText } from "@/components/ui/SmallText";
import AvatarIllustration from "@/assets/illustrations/avatar.svg";
import { User, Mail } from "lucide-react-native";
import { useUserStore } from "@/stores/user";
import { useState } from "react";

export default function Index() {
  const { inciarRegistro } = useUserStore();
  const [mail, setMail] = useState("");
  const [nickname, setNickname] = useState("");

  const handleRegister = async () => {
    try {
      await inciarRegistro(mail, nickname);
      router.push("/register/verify");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Crea tu cuenta</Title>
        <SubTitle>Y empezá a cocinar</SubTitle>
      </Column>

      <AvatarIllustration height={135} width={135} />

      <Column style={{ gap: 20 }}>
        <Input
          value={nickname}
          onChangeText={setNickname}
          Icon={User}
          placeholder="Nombre de usuario"
        />
        <Input
          value={mail}
          onChangeText={setMail}
          Icon={Mail}
          placeholder="Dirección de correo"
        />
      </Column>

      <Column>
        <Button onPress={handleRegister} style={{ marginBottom: 10 }}>
          Continuar Registración
        </Button>
        <SmallText>¿Ya tenés cuenta?</SmallText>
        <Link href="/login">
          <SmallText
            style={{ color: primary, textDecorationLine: "underline" }}
          >
            Iniciar sesión
          </SmallText>
        </Link>
      </Column>
    </Column>
  );
}
