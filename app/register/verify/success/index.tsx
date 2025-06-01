import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { Button } from "@/components/ui/Button";
import VerifiedIllustration from "@/assets/illustrations/confirmed.svg";
import { router } from "expo-router";

const index = () => {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <VerifiedIllustration style={{ height: 200, width: 200 }} />
      <Title>¡Se verificó con éxito!</Title>
      <Button
        onPress={() => {
          router.push("/home");
        }}
      >
        Continuar
      </Button>
    </Column>
  );
};

export default index;
