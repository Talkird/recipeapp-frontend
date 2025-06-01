import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Link, router } from "expo-router";
import { primary } from "@/utils/colors";
import { SmallText } from "@/components/ui/SmallText";
import PersonalInfo from "@/assets/illustrations/personal-information.svg";
import { CreditCard, Hash } from "lucide-react-native";
import CamaraUpload from "@/components/CamaraUpload";
const index = () => {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column style={{}}>
        <Title>Creá tu cuenta</Title>
        <SubTitle>Y empezá a cocinar</SubTitle>
      </Column>
      <PersonalInfo width={210} height={140} />
      <Input Icon={CreditCard} placeholder="Número de tarjeta" />

      <Column style={{ gap: 16 }}>
        <SmallText>Cargá una imagen del frente y el dorso de tu DNI:</SmallText>
        <CamaraUpload />
      </Column>

      <Input Icon={Hash} placeholder="Número de trámite" />
      <Button
        onPress={() => {
          router.push("/register/verify");
        }}
      >
        Finalizar
      </Button>
    </Column>
  );
};

export default index;
