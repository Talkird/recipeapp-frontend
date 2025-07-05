import axios from "axios";

export async function fetchTipoRecetaOptions(): Promise<string[]> {
  try {
    const res = await axios.post("http://localhost:8080/api/tiporeceta/getAll");
    if (Array.isArray(res.data)) {
      return res.data.map((tipo: any) => tipo.descripcion);
    }
    return [];
  } catch {
    return [];
  }
}

export async function fetchIngredienteOptions(): Promise<string[]> {
  try {
    const res = await axios.get("http://localhost:8080/ingredientes/get/All");
    if (Array.isArray(res.data)) {
      return res.data.map((ing: any) => ing.nombre);
    }
    return [];
  } catch {
    return [];
  }
}
