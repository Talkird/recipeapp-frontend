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
