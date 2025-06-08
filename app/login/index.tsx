import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { primary } from "@/utils/colors";
import { SmallText } from "@/components/ui/SmallText";
import { Link, router } from "expo-router";
import LoginIllustration from "@/assets/illustrations/login.svg";
import { Mail, Lock } from "lucide-react-native";
import CheckBox from "@/components/ui/CheckBox";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/user";

export default function Index() {
  const [rememberPassword, setRememberPassword] = useState(false);
  const [mail, setMail] = useState("");
  const [clave, setClave] = useState("");
  const { login, logout } = useUserStore();

  useEffect(() => {
    logout();
  }, []);

  const handleLogin = () => {
    if (!mail || !clave) {
      alert("Por favor, completa ambos campos.");
      return;
    }

    try {
      login(mail, clave);
      if (rememberPassword) {
        //santi lo hace
      }
      router.push("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales inválidas. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Iniciar sesión</Title>
        <SubTitle>Para compartír tus recetas con el mundo</SubTitle>
      </Column>

      <Column style={{ gap: 20 }}>
        <Input
          onChangeText={setMail}
          value={mail}
          Icon={Mail}
          placeholder="Dirección de correo"
        />
        <Input
          onChangeText={setClave}
          value={clave}
          Icon={Lock}
          type="password"
          placeholder="Contraseña"
        />
        <CheckBox
          label="¿Recordar contraseña?"
          value={rememberPassword}
          setValue={setRememberPassword}
        />
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
        <Button style={{ marginBottom: 10 }} onPress={handleLogin}>
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
