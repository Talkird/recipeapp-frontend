// Respuesta para el estado completo de asistencia
export interface EstadoAsistenciaResponseDTO {
  idAlumno: number;
  idCronograma: number;
  nombreAlumno: string;
  nombreCurso: string;
  nombreSede: string;
  estadoInscripcion: string; // "ACTIVA", "FINALIZADA", "CANCELADA"
  porcentajeAsistencia: number;
  clasesAsistidas: number;
  totalClases: number;
  cumpleMinimoAsistencia: boolean;
  yaRegistroHoy: boolean;
  fechaUltimaAsistencia: string;
  mensaje: string;
}
import { create } from "zustand";
import axios from "axios";
import { API_URLS } from "@/lib/constants";

const API_URL = API_URLS.CURSOS;
const ASISTENCIA_API_URL = API_URLS.ASISTENCIAS;
const QR_API_URL = API_URLS.QR;

export interface AsistenciaAlumnoDTO {
  // Información de la asistencia
  idAsistencia: number;
  fechaAsistencia: string;
  porcentajeAsistenciaActual: number;
  estado: string; // "PRESENTE", "AUSENTE", "JUSTIFICADO"
  
  // Información del alumno
  idAlumno: number;
  nombreAlumno: string;
  emailAlumno: string;
  
  // Información del curso
  idCurso: number;
  nombreCurso: string;
  modalidadCurso: string;
  duracionCurso: string;
  precioCurso: number;
  
  // Información del cronograma
  idCronograma: number;
  fechaInicioCronograma: string;
  fechaFinCronograma: string;
  
  // Información de la sede
  idSede: number;
  nombreSede: string;
  direccionSede: string;
  
  // Progreso en el curso
  totalClasesCurso: number;
  clasesAsistidasCurso: number;
  porcentajeCompletacionCurso: number;
  cumpleMinimoAsistencia: boolean; // ≥75%
  cursoCompletado: boolean;
  
  // Estado de la inscripción
  estadoInscripcion: string; // "ACTIVA", "FINALIZADA", "CANCELADA"
  fechaInscripcion: string;
  
  // Información adicional
  observaciones?: string;
  registradoPorQR: boolean;
  fechaRegistro: string;
}

export interface AsistenciaCronogramaDTO {
  // Información de la asistencia
  idAsistencia: number;
  fechaAsistencia: string;
  estado: string; // "PRESENTE", "AUSENTE", "JUSTIFICADO"
  porcentajeAsistenciaDelAlumno: number;
  
  // Información del alumno
  idAlumno: number;
  nombreAlumno: string;
  emailAlumno: string;
  telefonoAlumno: string;
  dniAlumno: string;
  
  // Información del cronograma
  idCronograma: number;
  fechaInicioCronograma: string;
  fechaFinCronograma: string;
  vacantesDisponibles: number;
  
  // Información del curso
  idCurso: number;
  nombreCurso: string;
  modalidadCurso: string;
  duracionCurso: string;
  precioCurso: number;
  contenidosCurso: string;
  
  // Información de la sede
  idSede: number;
  nombreSede: string;
  direccionSede: string;
  telefonoSede: string;
  
  // Progreso del alumno en este cronograma
  totalClasesEsperadas: number;
  clasesAsistidasPorAlumno: number;
  porcentajeProgreso: number;
  cumpleMinimoAsistencia: boolean; // ≥75%
  alumnoCompletoCurso: boolean;
  fechaCompletacion?: string;
  
  // Estado de la inscripción del alumno
  estadoInscripcionAlumno: string; // "ACTIVA", "FINALIZADA", "CANCELADA"
  fechaInscripcionAlumno: string;
  inscripcionActiva: boolean;
  
  // Información de registro de asistencia
  registradoPorQR: boolean;
  fechaRegistroAsistencia: string;
  ubicacionRegistro: string;
  observacionesAsistencia?: string;
  
  // Información adicional para gestión
  estadoGeneralCronograma: string; // "PROXIMO", "ACTIVO", "FINALIZADO"
  totalAlumnosInscriptos: number;
  totalAsistenciasRegistradas: number;
  porcentajeAsistenciaPromedio: number;
}

export interface DetalleAsistenciaDTO {
  idAsistencia: number;
  fechaAsistencia: string;
  idCronograma: number;
  fechaClase: string;
  estadoAsistencia: string;
}

export interface HistorialAsistenciaDTO {
  idAlumno: number;
  nombreAlumno: string;
  emailAlumno: string;
  idCurso: number;
  nombreCurso: string;
  modalidadCurso: string;
  fechaInicioCurso: string;
  fechaFinCurso: string;
  estaInscripto: boolean;
  totalClasesDictadas: number;
  clasesAsistidas: number;
  porcentajeAsistencia: number;
  porcentajeMinimoRequerido: number;
  cumpleMinimoAsistencia: boolean;
  cursoCompletado: boolean;
  fechaCompletacion?: string;
  detallesAsistencia: DetalleAsistenciaDTO[];
}

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
  /**
   * Flujo completo de registro de asistencia por QR.
   * @param params - { codigoQR, idAlumno, idCronograma, ubicacionDispositivo? }
   * @returns Promise<{ validacion, registro, estado }>
   */
  flujoQRAsistencia: (params: {
    codigoQR: string;
    idAlumno: number;
    idCronograma: number;
    ubicacionDispositivo?: string;
  }) => Promise<{
    validacion: ValidarCodigoQRResponseDTO | null;
    registro: AsistenciaValidacionResponseDTO | null;
    estado: EstadoAsistenciaResponseDTO | null;
  }>;
  cursos: Curso[];
  cursosDisponibles: CursoListaDTO[];
  cursosInscritos: CursoInscritoDTO[];
  fetchCursosDisponibles: () => Promise<void>; // Nuevo método para usuarios no-alumno
  fetchCursosDisponiblesParaAlumno: (idAlumno: number) => Promise<void>;
  fetchCursosInscritosParaAlumno: (idAlumno: number) => Promise<void>;
  fetchCursoById: (idCurso: number) => Promise<Curso | null>;
  fetchCursoDetalle: (idCurso: number) => Promise<CursoDetalleDTO | null>;
  crearInscripcion: (request: InscripcionRequest) => Promise<InscripcionResponse>;
  cancelarInscripcion: (idInscripcion: number, idAlumno: number) => Promise<BajaInscripcionResponse>;
  fetchHistorialAsistencia: (idAlumno: number, idCurso: number) => Promise<HistorialAsistenciaDTO | null>;
  fetchAsistenciasPorAlumno: (idAlumno: number) => Promise<AsistenciaAlumnoDTO[]>;
  fetchAsistenciasPorCronograma: (idCronograma: number) => Promise<AsistenciaCronogramaDTO[]>;
  registrarAsistenciaQR: (params: { codigoQR: string; idAlumno: number; ubicacionDispositivo?: string }) => Promise<AsistenciaValidacionResponseDTO | null>;
  obtenerPorcentajeAsistencia: (idAlumno: number, idCronograma: number) => Promise<PorcentajeAsistenciaResponseDTO | null>;
  verificarInscripcion: (idAlumno: number, idCronograma: number) => Promise<VerificarInscripcionResponseDTO | null>;
  validarCodigoQR: (params: { codigoQR: string; idAlumno: number }) => Promise<ValidarCodigoQRResponseDTO | null>;
  obtenerEstadoAsistencia: (idAlumno: number, idCronograma: number) => Promise<EstadoAsistenciaResponseDTO | null>;
  addCurso: (curso: Omit<Curso, "idCurso">) => Promise<void>;
  updateCurso: (idCurso: number, curso: Partial<Curso>) => Promise<void>;
  deleteCurso: (idCurso: number) => Promise<void>;
  actualizarAsistenciaCurso: (idCurso: number, idAlumno: number) => Promise<void>;
}


export const useCursoStore = create<CursoStore>((set) => ({
  /**
   * Flujo completo de registro de asistencia por QR:
   * 1. Valida el código QR para el alumno.
   * 2. Si es válido, registra la asistencia.
   * 3. Devuelve el resultado de la validación, registro y el estado actualizado de asistencia.
   * @param params { codigoQR: string, idAlumno: number, idCronograma: number, ubicacionDispositivo?: string }
   * @returns {Promise<{ validacion: ValidarCodigoQRResponseDTO | null, registro: AsistenciaValidacionResponseDTO | null, estado: EstadoAsistenciaResponseDTO | null }>}
   */
  flujoQRAsistencia: async ({
    codigoQR,
    idAlumno,
    idCronograma,
    ubicacionDispositivo,
  }: {
    codigoQR: string;
    idAlumno: number;
    idCronograma: number;
    ubicacionDispositivo?: string;
  }): Promise<{
    validacion: ValidarCodigoQRResponseDTO | null;
    registro: AsistenciaValidacionResponseDTO | null;
    estado: EstadoAsistenciaResponseDTO | null;
  }> => {
    // 1. Validar QR
    const validacion = await useCursoStore.getState().validarCodigoQR({ codigoQR, idAlumno });
    if (!validacion?.valido) {
      return { validacion, registro: null, estado: null };
    }
    // 2. Registrar asistencia
    const registro = await useCursoStore.getState().registrarAsistenciaQR({ codigoQR, idAlumno, ubicacionDispositivo });
    // 3. Consultar estado actualizado
    const estado = await useCursoStore.getState().obtenerEstadoAsistencia(idAlumno, idCronograma);
    return { validacion, registro, estado };
  },
  obtenerEstadoAsistencia: async (idAlumno: number, idCronograma: number) => {
    try {
      console.log(`Obteniendo estado de asistencia para alumno ${idAlumno} y cronograma ${idCronograma}`);
      const response = await axios.get(`${QR_API_URL}/estado-asistencia/${idAlumno}/${idCronograma}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener estado de asistencia:", error);
      return null;
    }
  },

  cursos: [],
  cursosDisponibles: [],
  cursosInscritos: [],

  // Método para obtener cursos disponibles sin necesidad de ser alumno
  fetchCursosDisponibles: async () => {
    try {
      // Usar el endpoint general de cursos
      const response = await axios.get(`${API_URL}`);
      set({ cursosDisponibles: response.data });
      console.log("Cursos disponibles obtenidos (público):", response.data.length);
    } catch (error) {
      console.error("Error al obtener cursos disponibles:", error);
      set({ cursosDisponibles: [] });
    }
  },

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
        API_URLS.INSCRIPCIONES + "/crear",
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
        `${API_URLS.INSCRIPCIONES}/${idInscripcion}/cancelar?idAlumno=${idAlumno}`
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

  fetchHistorialAsistencia: async (idAlumno, idCurso) => {
    try {
      console.log(`Obteniendo historial de asistencia para alumno ${idAlumno} y curso ${idCurso}`);
      const response = await axios.get(`${ASISTENCIA_API_URL}/historial/${idAlumno}/curso/${idCurso}`);
      
      console.log("Historial de asistencia obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener historial de asistencia:", error);
      return null;
    }
  },

  fetchAsistenciasPorAlumno: async (idAlumno) => {
    try {
      console.log(`Obteniendo todas las asistencias del alumno ${idAlumno}`);
      const response = await axios.get(`${ASISTENCIA_API_URL}/por-alumno/${idAlumno}`);
      
      console.log("Asistencias del alumno obtenidas:", response.data.length);
      return response.data;
    } catch (error) {
      console.error("Error al obtener asistencias por alumno:", error);
      return [];
    }
  },

  fetchAsistenciasPorCronograma: async (idCronograma) => {
    try {
      console.log(`Obteniendo todas las asistencias del cronograma ${idCronograma}`);
      const response = await axios.get(`${ASISTENCIA_API_URL}/por-cronograma/${idCronograma}`);
      
      console.log("Asistencias del cronograma obtenidas:", response.data.length);
      return response.data;
    } catch (error) {
      console.error("Error al obtener asistencias por cronograma:", error);
      return [];
    }
  },

  /**
   * Registra la asistencia de un alumno usando un código QR.
   * @param params { codigoQR: string, idAlumno: number, ubicacionDispositivo?: string }
   * @returns {AsistenciaValidacionResponseDTO | null}
   */
  registrarAsistenciaQR: async (params: { codigoQR: string; idAlumno: number; ubicacionDispositivo?: string }) => {
    try {
      console.log("Registrando asistencia por QR:", params);
      const response = await axios.post(`${QR_API_URL}/validar-asistencia`, params);
      console.log("Asistencia registrada exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al registrar asistencia por QR:", error);
      return null;
    }
  },

  obtenerPorcentajeAsistencia: async (idAlumno, idCronograma) => {
    try {
      console.log(`Obteniendo porcentaje de asistencia para alumno ${idAlumno} y cronograma ${idCronograma}`);
      const response = await axios.get(`${QR_API_URL}/porcentaje-asistencia/${idAlumno}/${idCronograma}`);
      
      console.log("Porcentaje de asistencia obtenido:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener porcentaje de asistencia:", error);
      return null;
    }
  },

  verificarInscripcion: async (idAlumno, idCronograma) => {
    try {
      console.log(`Verificando inscripción para alumno ${idAlumno} y cronograma ${idCronograma}`);
      const response = await axios.get(`${QR_API_URL}/verificar-inscripcion/${idAlumno}/${idCronograma}`);
      
      console.log("Verificación de inscripción completada:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al verificar inscripción:", error);
      return null;
    }
  },

  /**
   * Valida si un código QR es válido para un alumno antes de registrar asistencia.
   * @param params { codigoQR: string, idAlumno: number }
   * @returns {ValidarCodigoQRResponseDTO | null}
   */
  validarCodigoQR: async (params: { codigoQR: string; idAlumno: number }) => {
    try {
      console.log("Validando código QR para alumno:", params);
      const response = await axios.post(`${QR_API_URL}/validar-codigo`, params);
      console.log("Código QR validado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al validar código QR:", error);
      return null;
    }
  },

  actualizarAsistenciaCurso: async (idCurso, idAlumno) => {
    try {
      console.log(`Actualizando información de asistencia para curso ${idCurso} y alumno ${idAlumno}`);
      
      // Refrescar el detalle del curso para obtener información actualizada
      const response = await axios.get(`${API_URL}/${idCurso}/detalle`);
      const cursoActualizado = response.data;
      
      if (cursoActualizado) {
        set((state) => ({
          cursos: state.cursos.map(curso => 
            curso.idCurso === idCurso 
              ? { ...curso, ...cursoActualizado } 
              : curso
          )
        }));
      }
      
      console.log("Información de asistencia actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar información de asistencia:", error);
    }
  },
}));

export interface AsistenciaValidacionResponseDTO {
  exitoso: boolean;
  mensaje: string;
  idAsistencia: number;
  porcentajeAsistenciaActual: number;
  nombreCurso: string;
  nombreSede: string;
  fechaRegistro: string;
  clasesAsistidas: number;
  totalClases: number;
  cumpleMinimoAsistencia: boolean;
}

export interface PorcentajeAsistenciaResponseDTO {
  idAlumno: number;
  idCronograma: number;
  nombreAlumno: string;
  nombreCurso: string;
  nombreSede: string;
  porcentajeAsistencia: number;
  clasesAsistidas: number;
  totalClases: number;
  cumpleMinimoAsistencia: boolean;
  estadoCurso: string; // "PROXIMO", "ACTIVO", "FINALIZADO"
  mensaje: string;
}

export interface VerificarInscripcionResponseDTO {
  puedeRegistrarAsistencia: boolean;
  mensaje: string;
  idAlumno: number;
  idCronograma: number;
  nombreAlumno: string;
  nombreCurso: string;
  nombreSede: string;
  estadoInscripcion: string; // "ACTIVA", "FINALIZADA", "CANCELADA"
  fechaInscripcion: string;
  cronogramaActivo: boolean;
  razonRechazo?: string; // Razón por la cual no puede registrar asistencia
}

export interface ValidarCodigoQRResponseDTO {
  valido: boolean;
  mensaje: string;
  nombreCurso: string;
  sede: string;
  modalidad: string;
  fechaClase: string;
  ubicacionClase: string;
  puedeRegistrarAsistencia: boolean;
  motivoBloqueo?: string;
  fechaExpiracionQR: string;
}
