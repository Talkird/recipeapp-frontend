export type RecipeSearchFilterType =
  | "nombre"
  | "tipo"
  | "ingrediente"
  | "sin-ingrediente";

export interface RecipeSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  filterType: RecipeSearchFilterType;
  onFilterTypeChange: (type: RecipeSearchFilterType) => void;
  onSearch: () => void;
  tipoOptions?: string[];
  ingredienteOptions?: string[];
  loading?: boolean;
}
