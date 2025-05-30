import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Link, router } from "expo-router";
import { primary } from "@/utils/colors";
import { SmallText } from "@/components/ui/SmallText";
import AvatarIllustration from "@/assets/illustrations/avatar.svg";
import { User, Mail, Lock, RefreshCcw } from "lucide-react-native";

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Crea tu cuenta</Title>
        <SubTitle>Y empezá a cocinar</SubTitle>
      </Column>

      <AvatarIllustration height={135} width={135} />

      <Column style={{ gap: 20 }}>
        <Input Icon={User} placeholder="Nombre de usuario" />
        <Input Icon={Mail} placeholder="Dirección de correo" />
      </Column>

      <Column>
        <Button
          onPress={() => router.push("/register/verify")}
          style={{ marginBottom: 10 }}
        >
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
