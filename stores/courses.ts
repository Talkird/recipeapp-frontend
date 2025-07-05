import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8080/api/cursos";

export interface CursoInscritoDTO {
  idCurso: number;
  idInscripcion: number;
  idCronograma: number;
  descripcion: string;
  modalidad: string;
  duracion: string;
  precio: number;
  
  // Información de la inscripción
  estadoInscripcion: string; // ACTIVA, FINALIZADA, CANCELADA
  fechaInscripcion: string;
  completado: boolean;
  fechaCompletacion?: string;
  
  // Información del cronograma inscrito
  fechaInicio: string;
  fechaFin: string;
  nombreSede: string;
  direccionSede: string;
  
  // Información de progreso
  porcentajeAsistencia: number;
  clasesAsistidas: number;
  totalClases: number;
  puedeEscanearQR: boolean; // Si puede registrar asistencia por QR
}

export interface CursoListaDTO {
  idCurso: number;
  descripcion: string;
  modalidad: string;
  duracion: string;
  precio: number;
  tieneVacantes: boolean;
  tienePromocion: boolean;
  imagenPortada?: string; // URL de imagen del curso (opcional)
}

export interface CronogramaBasicoDTO {
  idCronograma: number;
  fechaInicio: string;
  fechaFin: string;
  vacantesDisponibles: number;
  nombreSede: string;
  direccionSede: string;
}

export interface CursoDetalleDTO {
  idCurso: number;
  descripcion: string;
  contenidos: string;
  requerimientos: string;
  duracion: string;
  precio: number;
  modalidad: string;
  
  // Información de cronogramas disponibles
  cronogramasDisponibles: CronogramaBasicoDTO[];
  
  // Información adicional
  tieneVacantes: boolean;
  tienePromocion: boolean;
  promocionDescripcion?: string;
  totalVacantes: number;
  imagenPortada?: string;
}

export interface InscripcionRequest {
  idAlumno: number;
  idCronograma: number; // Cronograma específico al que se inscribe
}

export interface InscripcionResponse {
  idInscripcion: number;
  idCurso: number;
  nombreCurso: string;
  precioCurso: number;
  saldoAnterior: number;
  saldoUtilizado: number;
  montoTarjeta: number;
  saldoRestante: number;
  metodoPago: string; // "CUENTA_CORRIENTE", "MIXTO", "TARJETA"
  mensaje: string;
  exitosa: boolean;
  numeroTarjeta?: string; // Últimos 4 dígitos para mostrar
}

export interface BajaInscripcionResponse {
  idInscripcion: number;
  idCurso: number;
  nombreCurso: string;
  precioOriginal: number;
  montoReintegro: number;
  porcentajeReintegro: number;
  saldoAnterior: number;
  saldoActual: number;
  motivoReintegro: string;
  mensaje: string;
  exitosa: boolean;
  diasAntesDeComienzo: number;
}

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
  cursosDisponibles: CursoListaDTO[];
  cursosInscritos: CursoInscritoDTO[];
  fetchCursosDisponiblesParaAlumno: (idAlumno: number) => Promise<void>;
  fetchCursosInscritosParaAlumno: (idAlumno: number) => Promise<void>;
  fetchCursoById: (idCurso: number) => Promise<Curso | null>;
  fetchCursoDetalle: (idCurso: number) => Promise<CursoDetalleDTO | null>;
  crearInscripcion: (request: InscripcionRequest) => Promise<InscripcionResponse>;
  cancelarInscripcion: (idInscripcion: number, idAlumno: number) => Promise<BajaInscripcionResponse>;
  addCurso: (curso: Omit<Curso, "idCurso">) => Promise<void>;
  updateCurso: (idCurso: number, curso: Partial<Curso>) => Promise<void>;
  deleteCurso: (idCurso: number) => Promise<void>;
}

export const useCursoStore = create<CursoStore>((set) => ({
  cursos: [],
  cursosDisponibles: [],
  cursosInscritos: [],

  fetchCursosDisponiblesParaAlumno: async (idAlumno) => {
    try {
      const response = await axios.post(`${API_URL}/disponibles-para-alumno`, {
        idAlumno
      });
      set({ cursosDisponibles: response.data });
      console.log("Cursos disponibles obtenidos:", response.data.length);
    } catch (error) {
      console.error("Error al obtener cursos disponibles para alumno:", error);
      set({ cursosDisponibles: [] });
    }
  },

  fetchCursosInscritosParaAlumno: async (idAlumno) => {
    try {
      const response = await axios.get(`${API_URL}/alumno/${idAlumno}/inscritos`);
      set({ cursosInscritos: response.data });
      console.log("Cursos inscritos obtenidos:", response.data.length);
    } catch (error) {
      console.error("Error al obtener cursos inscritos para alumno:", error);
      set({ cursosInscritos: [] });
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

  fetchCursoDetalle: async (idCurso) => {
    try {
      const response = await axios.get(`${API_URL}/detalle/${idCurso}`);
      console.log("Detalle del curso obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener detalle del curso:", error);
      return null;
    }
  },

  crearInscripcion: async (request) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/inscripciones/crear",
        request
      );
      console.log("Inscripción creada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al crear inscripción:", error);
      throw error;
    }
  },

  cancelarInscripcion: async (idInscripcion, idAlumno) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/inscripciones/${idInscripcion}/cancelar?idAlumno=${idAlumno}`
      );
      console.log("Inscripción cancelada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al cancelar inscripción:", error);
      throw error;
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
