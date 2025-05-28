import React from "react";
import { Column } from "@/components/ui/Column";
import AccessDenied from "@/assets/illustrations/access-denied.svg";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";

const index = () => {
  return (
    <Column style={{ flex: 1, gap: 64 }}>
      <Title>Sin Conexíon</Title>
      <AccessDenied style={{ width: 279, height: 268 }} />
      <SubTitle style={{ width: "50%" }}>
        Parece que estás desconectado. Volvé a intentar más tarde.
      </SubTitle>
    </Column>
  );
};

export default index;
