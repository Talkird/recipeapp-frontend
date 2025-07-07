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
import { Row } from "@/components/ui/Row";
import { ScrollView, SafeAreaView } from "react-native";

export default function Register() {
  const { inciarRegistro } = useUserStore();
  const [mail, setMail] = useState("");
  const [nickname, setNickname] = useState("");
  const [suggestedNicknames, setSuggestedNicknames] = useState<string[]>([]);

  const handleRegister = async () => {
    setSuggestedNicknames([]);
    try {
      await inciarRegistro(mail, nickname);
      router.push("/register/verify");
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        const data = error.response.data;
        if (data.sugerencias) {
          setSuggestedNicknames(data.sugerencias);
        }
        if (data.mensaje && data.mensaje.includes("correo")) {
          alert("El correo ya está en uso. Por favor, usá otro correo.");
        } else if (data.mensaje && data.mensaje.includes("alias")) {
          alert("El alias ya está en uso. Intentá con otro nombre de usuario.");
        } else {
          alert(data.mensaje || "El alias o correo ya está en uso.");
        }
      } else {
        alert("Error al registrar usuario");
      }
    }
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
          <Column style={{ alignItems: "center" }}>
            <Title>Crea tu cuenta</Title>
            <SubTitle>Y empezá a cocinar</SubTitle>
          </Column>

          <AvatarIllustration height={135} width={135} />

          <Column style={{ gap: 20, width: "100%" }}>
            <Input
              value={nickname}
              onChangeText={setNickname}
              Icon={User}
              placeholder="Nombre de usuario"
              style={{ width: "100%" }}
            />

            <Input
              value={mail}
              onChangeText={setMail}
              Icon={Mail}
              placeholder="Dirección de correo"
              style={{ width: "100%" }}
            />
            {suggestedNicknames.length > 0 && (
              <Column style={{ gap: 4, marginTop: 0 }}>
                <SubTitle>
                  Nombre de usuario ya en uso. Intentá con otro. Sugerencias:
                </SubTitle>
                <Row style={{ gap: 4 }}>
                  {suggestedNicknames.map((s, i) => (
                    <SmallText
                      key={i}
                      style={{
                        backgroundColor: "#00000066", // #000 with 0.4 opacity
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        color: "#fff",
                        alignSelf: "flex-start",
                      }}
                    >
                      {s}
                    </SmallText>
                  ))}
                </Row>
              </Column>
            )}
          </Column>

          <Column style={{ alignItems: "center", width: "100%" }}>
            <Button
              onPress={handleRegister}
              style={{ marginBottom: 10, width: "100%" }}
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
      </ScrollView>
    </SafeAreaView>
  );
}
