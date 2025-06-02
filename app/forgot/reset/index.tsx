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

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Title style={{ width: "50%" }}>Restablecer contraseña</Title>

      <ForgotPasswordIllustration width={205} height={135} />
      <Input Icon={Lock} placeholder="Nueva contraseña" />
      <Input Icon={RefreshCcw} placeholder="Confirmar contraseña" />

      <Button onPress={() => router.push("/forgot/success")}>Finalizar</Button>
    </Column>
  );
}
