import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import AccessDeniedIllustration from "@/assets/illustrations/access-denied.svg";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";

const index = () => {
  const handleRetry = () => {
    router.push("/home");
  };

  return (
    <Column style={{ flex: 1, gap: 64 }}>
      <Title>Sin Conexión</Title>
      <AccessDeniedIllustration width={279} height={268} />
      <SubTitle>
        Parece que estás desconectado. Volvé a intentar más tarde.
      </SubTitle>
      <Button onPress={handleRetry}>Volver a intentar</Button>
    </Column>
  );
};

export default index;
