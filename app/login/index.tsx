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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, View, ScrollView, SafeAreaView } from "react-native";

export default function Index() {
  const [rememberPassword, setRememberPassword] = useState(false);
  const [mail, setMail] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, logout } = useUserStore();

  useEffect(() => {
    logout();
    loadStoredCredentials();
  }, []);

  const loadStoredCredentials = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem("userCredentials");
      if (storedCredentials) {
        const { mail: storedMail, password } = JSON.parse(storedCredentials);
        setMail(storedMail);
        setClave(password);
        setRememberPassword(true);
      }
    } catch (error) {
      console.error("Error loading stored credentials:", error);
    }
  };

  const handleLogin = async () => {
    if (!mail || !clave) {
      Alert.alert("Error", "Por favor, completa ambos campos.");
      return;
    }

    setLoading(true);
    try {
      await login(mail, clave);

      if (rememberPassword) {
        // Save credentials to device storage
        await AsyncStorage.setItem(
          "userCredentials",
          JSON.stringify({
            mail,
            password: clave,
          })
        );
      } else {
        // Remove stored credentials if user doesn't want to remember
        await AsyncStorage.removeItem("userCredentials");
      }

      router.replace("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert(
        "Error",
        "Credenciales inválidas. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Column
          style={{
            flex: 1,
            gap: 32,
            maxWidth: 400,
            alignSelf: "center",
            width: "100%",
          }}
        >
          <Column style={{ alignItems: "center" }}>
            <Title>Iniciar sesión</Title>
            <SubTitle>Para compartír tus recetas con el mundo</SubTitle>
          </Column>

          <Column style={{ gap: 20, width: "100%" }}>
            <Input
              onChangeText={setMail}
              value={mail}
              Icon={Mail}
              placeholder="Dirección de correo"
              style={{ width: "100%" }}
            />
            <Input
              onChangeText={setClave}
              value={clave}
              Icon={Lock}
              type="password"
              placeholder="Contraseña"
              style={{ width: "100%" }}
            />
            <View style={{ alignItems: "flex-start", width: "100%" }}>
              <CheckBox
                label="¿Recordar contraseña?"
                value={rememberPassword}
                setValue={setRememberPassword}
              />
            </View>
          </Column>

          <Column style={{ alignItems: "center" }}>
            <SmallText>¿Olvidaste tu contraseña?</SmallText>
            <Link href="/forgot">
              <SmallText
                style={{ color: primary, textDecorationLine: "underline" }}
              >
                Recuperar
              </SmallText>
            </Link>
          </Column>

          <View style={{ alignItems: "center", marginVertical: 20 }}>
            <LoginIllustration height={135} width={135} />
          </View>

          <Column style={{ alignItems: "center", gap: 10 }}>
            <Button
              style={{ marginBottom: 10, width: "100%" }}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            <SmallText>¿No tenés cuenta?</SmallText>
            <Link href="/register/choice">
              <SmallText
                style={{ color: primary, textDecorationLine: "underline" }}
              >
                Registrate
              </SmallText>
            </Link>
            <Link href="/">
              <SmallText
                style={{ color: primary, textDecorationLine: "underline" }}
              >
                Volver al inicio
              </SmallText>
            </Link>
          </Column>
        </Column>
      </ScrollView>
    </SafeAreaView>
  );
}
