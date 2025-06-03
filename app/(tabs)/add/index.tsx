import React from "react";
import { ScrollView } from "react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Row } from "@/components/ui/Row";
import {
  FileQuestion,
  Hash,
  Hourglass,
  PersonStanding,
  Pipette,
  Pizza,
} from "lucide-react-native";
import RNPickerSelect from "react-native-picker-select";
import { SmallText } from "@/components/ui/SmallText";

export default function Index() {
  const [nameVerified, setNameVerified] = React.useState(false);
  const [recipeName, setRecipeName] = React.useState("");
  const [recipeDescription, setRecipeDescription] = React.useState("");
  const [estimatedTime, setEstimatedTime] = React.useState("");
  const [servings, setServings] = React.useState("");
  const [ingredientName, setIngredientName] = React.useState("");
  const [ingredientQuantity, setIngredientQuantity] = React.useState("");
  const [ingredientUnit, setIngredientUnit] = React.useState("");

  const handleVerifyName = () => {
    setNameVerified(true);
  };

  // Ingredient type for TypeScript
  type Ingredient = {
    name: string;
    quantity: string;
    unit: string;
  };

  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);

  const handleAddIngredient = () => {
    if (ingredientName && ingredientQuantity && ingredientUnit) {
      setIngredients([
        ...ingredients,
        {
          name: ingredientName,
          quantity: ingredientQuantity,
          unit: ingredientUnit,
        },
      ]);
      setIngredientName("");
      setIngredientQuantity("");
      setIngredientUnit("");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, marginBottom: 32 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Column
        style={{
          flex: 1,
          gap: 32,
          justifyContent: "flex-start",
          marginTop: 32,
        }}
      >
        <Title>Creá tu receta</Title>
        <Column style={{ gap: 16 }}>
          <SubTitle>Nombre de la receta</SubTitle>
          <Input
            disabled={nameVerified}
            Icon={FileQuestion}
            placeholder="Nombre de la receta"
          />
          <Button onPress={handleVerifyName}>Verificar nombre</Button>
        </Column>

        {nameVerified && (
          <>
            <Column style={{ gap: 16 }}>
              <SubTitle>Agregá ingredientes a tu receta</SubTitle>
              <Input
                Icon={Pizza}
                placeholder="Nombre del ingrediente"
                value={ingredientName}
                onChangeText={setIngredientName}
              />
              <Input
                Icon={Hash}
                placeholder="Cantidad"
                value={ingredientQuantity}
                onChangeText={setIngredientQuantity}
              />
              <Input
                Icon={Pipette}
                value={ingredientUnit}
                onChangeText={setIngredientUnit}
                placeholder="Unidad"
              />
              <Button onPress={handleAddIngredient}>Agregar</Button>
            </Column>

            <Column>
              <SubTitle>Lista de ingredientes</SubTitle>
              {ingredients.length > 0 ? (
                ingredients.map((ingredient, index) => (
                  <Row key={index} style={{ flexDirection: "row", gap: 8 }}>
                    <SmallText>{ingredient.name}</SmallText>
                    <SmallText>{ingredient.quantity}</SmallText>
                    <SmallText>{ingredient.unit}</SmallText>
                  </Row>
                ))
              ) : (
                <SmallText>No hay ingredientes agregados</SmallText>
              )}
            </Column>
          </>
        )}
        <Column style={{ gap: 16 }}>
          <SubTitle>Información de la receta</SubTitle>
          <Input Icon={Hourglass} placeholder="Tiempo estimado en minutos" />
          <Input Icon={PersonStanding} placeholder="Cantidad de personas" />
        </Column>
      </Column>
    </ScrollView>
  );
}
