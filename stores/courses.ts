import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8080/api/cursos";

export interface Sede {
  idSede: number;
  nombreSede: string;
  direccionSede: string;
  telefonoSede: string;
  mailSede: string;
  whatsapp: string;
  tipoBonificacion: string;
  bonificacionCursos: string;
  tipoPromocion: string;
  promocionCursos: string;
}

export interface CronogramaCurso {
  idCronograma: number;
  sede: Sede;
  fechaInicio: string;
  fechaFin: string;
  vacantesDisponibles: number;
}

export interface Curso {
  idCurso: number;
  descripcion: string;
  contenidos: string;
  requerimientos: string;
  duracion: string;
  precio: number;
  modalidad: string;
  cronogramas?: CronogramaCurso[];
}

interface CursoStore {
  cursos: Curso[];
  fetchCursos: () => Promise<void>;
  fetchCursoById: (idCurso: number) => Promise<Curso | null>;
  addCurso: (curso: Omit<Curso, "idCurso">) => Promise<void>;
  updateCurso: (idCurso: number, curso: Partial<Curso>) => Promise<void>;
  deleteCurso: (idCurso: number) => Promise<void>;
}

export const useCursoStore = create<CursoStore>((set) => ({
  cursos: [],

  fetchCursos: async () => {
    try {
      const response = await axios.get(API_URL);
      set({ cursos: response.data });
    } catch (error) {
      console.error("Error fetching cursos:", error);
    }
  },

  fetchCursoById: async (idCurso) => {
    try {
      const response = await axios.get(`${API_URL}/${idCurso}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching curso by id:", error);
      return null;
    }
  },

  addCurso: async (curso) => {
    try {
      const response = await axios.post(API_URL, curso);
      set((state) => ({
        cursos: [...state.cursos, response.data],
      }));
    } catch (error) {
      console.error("Error adding curso:", error);
    }
  },

  updateCurso: async (idCurso, curso) => {
    try {
      const response = await axios.put(`${API_URL}/${idCurso}`, curso);
      set((state) => ({
        cursos: state.cursos.map((c) =>
          c.idCurso === idCurso ? response.data : c
        ),
      }));
    } catch (error) {
      console.error("Error updating curso:", error);
    }
  },

  deleteCurso: async (idCurso) => {
    try {
      await axios.delete(`${API_URL}/${idCurso}`);
      set((state) => ({
        cursos: state.cursos.filter((c) => c.idCurso !== idCurso),
      }));
    } catch (error) {
      console.error("Error deleting curso:", error);
    }
  },
}));
