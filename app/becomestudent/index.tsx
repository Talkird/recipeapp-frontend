import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import Cooking from "@/assets/illustrations/cooking.svg";
import { Button } from "@/components/ui/button";

const index = () => {
  return (
    <Column style={{ flex: 1, gap: 64 }}>
      <Column style={{ gap: 8 }}>
        <Title style={{ width: "80%" }}>Convertite en alumno hoy</Title>
        <SubTitle style={{ width: "50%" }}>
          Convertite en alumno para acceder a este curso y muchos más
        </SubTitle>
      </Column>
      <Cooking style={{ width: 207, height: 177 }} />
      <Button>Convertirse en alumno</Button>
    </Column>
  );
};

export default index;
