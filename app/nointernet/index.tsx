import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import AccessDeniedIllustration from "@/assets/illustrations/access-denied.svg";

const index = () => {
  return (
    <Column style={{ flex: 1, gap: 64 }}>
      <Title>Sin Conexión</Title>
      <AccessDeniedIllustration width={279} height={268} />
      <SubTitle>
        Parece que estás desconectado. Volvé a intentar más tarde.
      </SubTitle>
    </Column>
  );
};

export default index;
