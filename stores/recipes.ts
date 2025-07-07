import { create } from "zustand";
import axios from "axios";
import { API_URLS } from "@/lib/constants";

const API_URL = API_URLS.RECETAS;

interface Receta {
  idReceta: number;
  nombreReceta: string;
  usuario: string;
  calificacion: number;
  cantidadPersonas: number;
  duracion: number;
  fotoPrincipal: string;
}

interface RecetaStore {
  recetas: Receta[];
  fetchRecetas: () => Promise<void>;
  fetchByNombre: (
    nombre: string,
    criterio?: string,
    orden?: string
  ) => Promise<void>;
  fetchByTipo: (
    tipo: string,
    criterio?: string,
    orden?: string
  ) => Promise<void>;
  fetchByIngrediente: (
    ingrediente: string,
    criterio?: string,
    orden?: string
  ) => Promise<void>;
  fetchSinIngrediente: (
    ingrediente: string,
    criterio?: string,
    orden?: string
  ) => Promise<void>;
  addReceta: (receta: Receta) => Promise<void>;
  updateReceta: (receta: Receta) => Promise<void>;
  deleteReceta: (idReceta: number) => Promise<void>;
}

export const useRecetaStore = create<RecetaStore>((set, get) => ({
  recetas: [],

  fetchRecetas: async () => {
    try {
      const response = await axios.get(API_URL + "/aprobadas");
      const recetas = response.data.map((receta: any) => ({
        ...receta,
        idReceta: receta.id,
      }));
      set({ recetas });
    } catch (error) {
      console.error("Error fetching recetas:", error);
    }
  },

  fetchByNombre: async (nombre: string, criterio?: string, orden?: string) => {
    try {
      let url = `${API_URL}/search/nombre/${encodeURIComponent(nombre)}`;
      const params: any = {};
      if (criterio) params.criterio = criterio;
      if (orden) params.orden = orden;
      const response = await axios.get(url, { params });
      const recetas = response.data.map((receta: any) => ({
        ...receta,
        idReceta: receta.id,
      }));
      set({ recetas });
    } catch (error) {
      console.error("Error fetching recetas by nombre:", error);
    }
  },

  fetchByTipo: async (tipo: string, criterio?: string, orden?: string) => {
    try {
      let url = `${API_URL}/search/Tipo/${encodeURIComponent(tipo)}`;
      const params: any = {};
      if (criterio) params.criterio = criterio;
      if (orden) params.orden = orden;
      const response = await axios.get(url, { params });
      const recetas = response.data.map((receta: any) => ({
        ...receta,
        idReceta: receta.id,
      }));
      set({ recetas });
    } catch (error) {
      console.error("Error fetching recetas by tipo:", error);
    }
  },

  fetchByIngrediente: async (
    ingrediente: string,
    criterio?: string,
    orden?: string
  ) => {
    try {
      let url = `${API_URL}/search/ingrediente/${encodeURIComponent(
        ingrediente
      )}`;
      const params: any = {};
      if (criterio) params.criterio = criterio;
      if (orden) params.orden = orden;
      const response = await axios.get(url, { params });
      const recetas = response.data.map((receta: any) => ({
        ...receta,
        idReceta: receta.id,
      }));
      set({ recetas });
    } catch (error) {
      console.error("Error fetching recetas by ingrediente:", error);
    }
  },

  fetchSinIngrediente: async (
    ingrediente: string,
    criterio?: string,
    orden?: string
  ) => {
    try {
      let url = `${API_URL}/search/sin-ingrediente/${encodeURIComponent(
        ingrediente
      )}`;
      const params: any = {};
      if (criterio) params.criterio = criterio;
      if (orden) params.orden = orden;
      const response = await axios.get(url, { params });
      const recetas = response.data.map((receta: any) => ({
        ...receta,
        idReceta: receta.id,
      }));
      set({ recetas });
    } catch (error) {
      console.error("Error fetching recetas sin ingrediente:", error);
    }
  },

  addReceta: async (receta) => {
    try {
      const response = await axios.post(API_URL, receta);
      set((state) => ({
        recetas: [...state.recetas, response.data],
      }));
    } catch (error) {
      console.error("Error adding receta:", error);
    }
  },

  updateReceta: async (receta) => {
    try {
      const response = await axios.put(`${API_URL}/${receta.idReceta}`, receta);
      set((state) => ({
        recetas: state.recetas.map((r) =>
          r.idReceta === receta.idReceta ? response.data : r
        ),
      }));
    } catch (error) {
      console.error("Error updating receta:", error);
    }
  },

  deleteReceta: async (idReceta) => {
    try {
      await axios.delete(`${API_URL}/${idReceta}`);
      set((state) => ({
        recetas: state.recetas.filter((r) => r.idReceta !== idReceta),
      }));
    } catch (error) {
      console.error("Error deleting receta:", error);
    }
  },
}));
