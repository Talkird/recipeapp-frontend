import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8080/api/recetas";

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
  addReceta: (receta: Receta) => Promise<void>;
  updateReceta: (receta: Receta) => Promise<void>;
  deleteReceta: (idReceta: number) => Promise<void>;
}

export const useRecetaStore = create<RecetaStore>((set, get) => ({
  recetas: [],

  fetchRecetas: async () => {
    try {
      const response = await axios.get(API_URL);
      const recetas = response.data.map((receta: any) => ({
        ...receta,
        idReceta: receta.id,
      }));
      set({ recetas });
    } catch (error) {
      console.error("Error fetching recetas:", error);
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
