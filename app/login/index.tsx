import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { primary } from "@/utils/colors";
import { SmallText } from "@/components/ui/SmallText";
import { Link, router } from "expo-router";
import LoginIllustration from "@/assets/illustrations/login.svg";
import { Mail, Lock } from "lucide-react-native";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { View } from "react-native";

export default function Index() {
  const [checked, setChecked] = useState(false);

  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Iniciar sesión</Title>
        <SubTitle>Para compartír tus recetas con el mundo</SubTitle>
      </Column>

      <Column style={{ gap: 20 }}>
        <Input Icon={Mail} placeholder="Dirección de correo" />
        <Input Icon={Lock} type="password" placeholder="Contraseña" />
        <View className="flex-row gap-2 items-center">
          <SmallText>Recordar contraseña</SmallText>
          <Checkbox checked={checked} onCheckedChange={setChecked} />
        </View>
      </Column>

      <Column>
        <SmallText>¿Olvidaste tu contraseña?</SmallText>
        <Link href="/forgot">
          <SmallText
            style={{ color: primary, textDecorationLine: "underline" }}
          >
            Recuperar
          </SmallText>
        </Link>
      </Column>

      <LoginIllustration height={135} width={135} />
      <Column>
        <Button
          style={{ marginBottom: 10 }}
          onPress={() => router.push("/home")}
        >
          Iniciar sesión
        </Button>
        <SmallText>¿No tenés cuenta?</SmallText>
        <Link href="/register/choice">
          <SmallText
            style={{ color: primary, textDecorationLine: "underline" }}
          >
            Registrate
          </SmallText>
        </Link>
      </Column>
    </Column>
  );
}
