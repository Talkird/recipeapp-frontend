import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import Input from "@/components/ui/Input";
import { Link, router } from "expo-router";
import { Button } from "@/components/ui/Button";
import { primary } from "@/utils/colors";
import ForgotPasswordIllustration from "@/assets/illustrations/forgot-password.svg";
import { Mail } from "lucide-react-native";

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>¿Olvidaste tu contraseña?</Title>
        <SubTitle>
          Ingresá tu correo electrónico y te enviaremos un enlace para
          restablecer tu clave.
        </SubTitle>
      </Column>
      <Input Icon={Mail} placeholder="Dirección de correo" />

      <Column>
        <SmallText>¿Recordaste tu clave?</SmallText>
        <Link href="/login">
          <SmallText
            style={{ color: primary, textDecorationLine: "underline" }}
          >
            Iniciar sesión
          </SmallText>
        </Link>
      </Column>

      <ForgotPasswordIllustration width={205} height={135} />
      <Button onPress={() => router.push("/forgot/verify")}>
        Enviar enlace
      </Button>
    </Column>
  );
}
