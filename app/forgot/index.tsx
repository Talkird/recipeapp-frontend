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
import { useState } from "react";
import { useUserStore } from "@/stores/user";
import { ScrollView, SafeAreaView } from "react-native";

export default function Index() {
  const [mail, setMail] = useState("");
  const { recuperarClave } = useUserStore();

  const handleSendLink = () => {
    if (!mail) {
      alert("Por favor, ingresa tu correo electrónico.");
      return;
    }

    recuperarClave(mail)
      .then(() => {
        router.push("/forgot/verify");
      })
      .catch((error) => {
        console.error("Error al enviar el enlace de recuperación:", error);
        alert(
          "Ocurrió un error al enviar el enlace. Inténtalo de nuevo más tarde."
        );
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Column
          style={{
            flex: 1,
            gap: 32,
            alignItems: "center",
            maxWidth: 400,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <Column style={{ gap: 16, alignItems: "center" }}>
            <Title>¿Olvidaste tu contraseña?</Title>
            <SubTitle style={{ textAlign: "center", paddingHorizontal: 16 }}>
              Ingresá tu correo electrónico y te enviaremos un enlace para
              restablecer tu clave.
            </SubTitle>
          </Column>

          <ForgotPasswordIllustration width={205} height={135} />

          <Input
            onChangeText={setMail}
            value={mail}
            Icon={Mail}
            placeholder="Dirección de correo"
            style={{ width: "100%" }}
          />

          <Button onPress={handleSendLink} style={{ width: "100%" }}>
            Enviar enlace
          </Button>

          <Column style={{ alignItems: "center" }}>
            <SmallText>¿Recordaste tu clave?</SmallText>
            <Link href="/login">
              <SmallText
                style={{ color: primary, textDecorationLine: "underline" }}
              >
                Iniciar sesión
              </SmallText>
            </Link>
          </Column>
        </Column>
      </ScrollView>
    </SafeAreaView>
  );
}
