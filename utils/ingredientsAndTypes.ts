import axios from "axios";
import { API_URLS } from "@/lib/constants";

export async function fetchTipoRecetaOptions(): Promise<string[]> {
  try {
    const res = await axios.post(`${API_URLS.TIPOS_RECETA}/getAll`);
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
    const res = await axios.get(`${API_URLS.INGREDIENTES}/get/All`);
    if (Array.isArray(res.data)) {
      return res.data.map((ing: any) => ing.nombre);
    }
    return [];
  } catch {
    return [];
  }
}
