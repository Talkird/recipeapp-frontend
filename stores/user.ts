import { create } from "zustand";
import axios from "axios";
import { API_URLS } from "@/lib/constants";

const API_URL = API_URLS.USUARIOS;
const API_URL_ALUMNO = API_URLS.ALUMNOS;

interface Alumno {
  idAlumno: number;
  numeroTarjeta: string;
  dniFrente: string;
  dniFondo?: string;
  tramite?: string;
  cuentaCorriente?: number; // Opcional, podría estar aquí
  saldo?: number; // Opcional, podría estar aquí
}

// Tipo para la respuesta de la API de información de cuenta
interface AccountInfoResponse {
  idUsuario: number;
  mail: string;
  nickname: string;
  nombre: string | null;
  direccion: string | null;
  avatar: string | null;
  habilitado: boolean;
  alumno?: Alumno; // Nested alumno object
  cuentaCorriente?: number; // Fallback location
  saldo?: number; // Fallback location
  numeroTarjeta?: string; // Fallback location
}

interface UserStore {
  mail: string | null;
  nickname: string | null;
  clave: string | null;
  idUsuario: number | null;
  alumnoId: number | null;
  jwt: string | null;
  nombre: string | null;
  direccion: string | null;
  esAlumno: boolean;
  choiceAlumno: boolean;
  setChoiceAlumno: (choice: boolean) => void;
  inciarRegistro: (mail: string, nickname: string) => Promise<void>;
  validarCodigoRegistro: (mail: string, codigo: string) => Promise<void>;
  finalizarRegistro: (clave: string, confirmarClave: string) => Promise<void>;
  recuperarClave: (mail: string) => Promise<void>;
  validarCodigoRecuperacion: (mail: string, codigo: string) => Promise<void>;
  actualizarClave: (
    nuevaClave: string,
    confirmarClave: string
  ) => Promise<void>;
  logout: () => void;
  login: (mail: string, password: string) => Promise<void>;
  updateUserId: (mail: string) => Promise<void>;
  createAlumno: (
    tramite: string,
    numeroTarjeta: string,
    dniFrente: string,
    dniFondo: string,
    cuentaCorriente?: string
  ) => Promise<void>;
  getAccountInfo: () => Promise<AccountInfoResponse | null>;
  isAlumno: () => Promise<boolean>;
  getAlumnoId: () => Promise<number | null>;
  refreshAlumnoId: () => Promise<void>;
  getAlumnoDetails: () => Promise<Alumno | null>;
  getSaldo: () => Promise<number | null>;
  getNumeroTarjeta: () => Promise<string | null>;
  setAuthToken: (token: string | null) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  mail: null,
  nickname: null,
  clave: null,
  idUsuario: null,
  alumnoId: null,
  jwt: null,
  nombre: null,
  direccion: null,
  esAlumno: false,
  choiceAlumno: false,

  refreshAlumnoId: async () => {
    const { idUsuario } = get();
    if (!idUsuario) {
      set({ alumnoId: null });
      return;
    }
    try {
      // Usar getAccountInfo que ya trae la información del alumno
      await get().getAccountInfo();
    } catch (error) {
      console.error("Error al refrescar el id del alumno:", error);
      set({ alumnoId: null });
    }
  },

  getAlumnoId: async () => {
    const { idUsuario, alumnoId } = get();
    if (!idUsuario) return null;
    
    // Si ya tenemos el alumnoId en el estado, lo devolvemos
    if (alumnoId) return alumnoId;
    
    try {
      // Usar getAccountInfo para obtener la información completa
      const accountInfo = await get().getAccountInfo();
      
      // El alumnoId debería haber sido actualizado por getAccountInfo
      const { alumnoId: newAlumnoId } = get();
      return newAlumnoId;
    } catch (error) {
      console.error("Error al obtener el id del alumno:", error);
      return null;
    }
  },

  isAlumno: async () => {
    const { idUsuario, esAlumno } = get();
    if (!idUsuario) return false;
    
    // Si ya tenemos la información en el store, usarla
    if (esAlumno !== undefined) {
      return esAlumno;
    }
    
    // Solo si no tenemos la información, hacer la llamada al backend
    try {
      const response = await axios.get(
        `${API_URLS.ALUMNOS}/usuario/${idUsuario}/es-alumno`
      );
      const isAlumnoResult = response.data === true;
      set({ esAlumno: isAlumnoResult });
      return isAlumnoResult;
    } catch (error) {
      console.error("Error al verificar si el usuario es alumno:", error);
      return false;
    }
  },

  setChoiceAlumno: (choice) => {
    set({ choiceAlumno: choice });
  },

  setAuthToken: (token) => {
    if (token) {
      // Configurar el token en todas las peticiones de axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Remover el token
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  getAccountInfo: async () => {
    const { idUsuario } = get();
    try {
      const response = await axios.get(`${API_URL}/${idUsuario}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.data) {
        console.warn(
          "No se encontró información de la cuenta para el ID:",
          idUsuario
        );
        return null;
      } else {
        const { mail, nickname, nombre, direccion } = response.data;
        
        // Extraer alumnoId del JSON string para evitar problemas de referencias circulares
        let alumnoId = null;
        try {
          const jsonString = JSON.stringify(response.data);
          const alumnoMatch = jsonString.match(/"idAlumno":(\d+)/);
          if (alumnoMatch) {
            alumnoId = parseInt(alumnoMatch[1], 10);
            console.log("AlumnoId extraído del JSON:", alumnoId);
            set({ alumnoId, esAlumno: true });
          } else {
            console.log("No se encontró idAlumno en la respuesta");
            set({ alumnoId: null, esAlumno: false });
          }
        } catch (error) {
          console.error("Error al extraer alumnoId:", error);
          set({ alumnoId: null, esAlumno: false });
        }
        
        set({ mail, nickname, nombre, direccion });
        return response.data;
      }
    } catch (error) {
      console.error("Error al obtener la información de la cuenta:", error);
      throw error;
    }
  },

  updateUserId: async (mail) => {
    try {
      const response = await axios.get(`${API_URL}/mail/${mail}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const idUsuario = response.data.idUsuario;
      console.log("ID del usuario obtenido:", idUsuario);
      set({ idUsuario });
    } catch (error) {
      console.error("Error al obtener el ID del usuario:", error);
      throw error;
    }
  },
  logout: () => {
    // Limpiar el token de autenticación
    get().setAuthToken(null);
    
    set({
      mail: null,
      nickname: null,
      clave: null,
      idUsuario: null,
      alumnoId: null,
      jwt: null,
      nombre: null,
      direccion: null,
      esAlumno: false,
      choiceAlumno: false,
    });
  },

  login: async (mail, password) => {
    try {
      const response = await axios.post(`${API_URLS.AUTH}/login`, {
        mail,
        password,
      });
      
      // Usar toda la información que devuelve el backend
      const { 
        jwt, 
        idUsuario, 
        mail: userMail, 
        nickname, 
        nombre, 
        esAlumno, 
        idAlumno 
      } = response.data;
      
      // Actualizar el store con toda la información
      set({ 
        mail: userMail,
        nickname,
        nombre,
        idUsuario,
        jwt,
        esAlumno,
        alumnoId: idAlumno || null, // Solo si es alumno
      });
      
      // Configurar el token para futuras peticiones
      get().setAuthToken(jwt);
      
      console.log("Login exitoso. Usuario:", { idUsuario, nickname, esAlumno, idAlumno });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },

  inciarRegistro: async (mail, nickname) => {
    try {
      await axios.post(API_URL, { mail, nickname });
      set({ mail, nickname });
    } catch (error) {
      console.error("Error al iniciar registro:", error);
      throw error;
    }
  },
  validarCodigoRegistro: async (mail, codigo) => {
    try {
      const response = await axios.post(`${API_URL}/validar-codigo`, {
        mail,
        codigo,
      });
    } catch (error) {
      console.error("Error al validar código:", error);
      throw error;
    }
  },
  finalizarRegistro: async (clave, confirmarClave) => {
    const { mail } = get();

    try {
      const response = await axios.post(`${API_URL}/establecer-clave`, {
        password: clave,
        confirmPassword: confirmarClave,
        mail,
      });
      set({ mail });

      if (mail) {
        get().updateUserId(mail);
      }
    } catch (error) {
      console.error("Error al finalizar registro:", error);
      throw error;
    }
  },
  recuperarClave: async (mail) => {
    try {
      get().logout();
      await axios.post(`${API_URL}/recuperar-clave`, { mail });
      set({ mail });
    } catch (error) {
      console.error("Error al recuperar clave:", error);
      throw error;
    }
  },
  validarCodigoRecuperacion: async (mail, codigo) => {
    try {
      await axios.post(`${API_URL}/validar-codigo-recuperacion`, {
        mail,
        codigo,
      });
    } catch (error) {
      console.error("Error al validar código de recuperación:", error);
      throw error;
    }
  },
  actualizarClave: async (nuevaClave, confirmarClave) => {
    const { mail } = get();

    try {
      await axios.put(`${API_URL}/actualizar-clave`, {
        nuevaClave,
        confirmarClave,
        mail,
      });
      get().logout();
    } catch (error) {
      console.error("Error al actualizar clave:", error);
      throw error;
    }
  },

  createAlumno: async (tramite, numeroTarjeta, dniFrente, dniFondo, cuentaCorriente) => {
    try {
      const { idUsuario } = get();

      // Preparar el body con todos los campos necesarios
      const requestBody: any = {
        idUsuario,
        tramite,
        numeroTarjeta,
        dniFrente,
        dniFondo,
      };

      // Agregar cuentaCorriente si se proporciona
      if (cuentaCorriente) {
        requestBody.cuentaCorriente = cuentaCorriente;
      }

      const response = await axios.post(`${API_URL_ALUMNO}/crear`, requestBody);
      
      // Usar toda la información que devuelve el backend
      const { 
        idAlumno, 
        numeroTarjeta: respNumeroTarjeta,
        dniFrente: respDniFrente,
        dniFondo: respDniFondo,
        tramite: respTramite,
        cuentaCorriente: respCuentaCorriente,
        usuario 
      } = response.data;
      
      // Actualizar el store con la información del alumno
      set({ 
        alumnoId: idAlumno,
        esAlumno: true,
      });

      // Si la respuesta incluye información actualizada del usuario, usarla
      if (usuario) {
        const { mail, nickname, nombre, direccion } = usuario;
        set({ 
          mail: mail || get().mail,
          nickname: nickname || get().nickname,
          nombre: nombre || get().nombre,
          direccion: direccion || get().direccion,
        });
      }
      
      console.log("Alumno creado exitosamente:", { 
        idAlumno, 
        numeroTarjeta: respNumeroTarjeta,
        cuentaCorriente: respCuentaCorriente 
      });
      
      return response.data;
    } catch (error) {
      console.error("Error al crear alumno:", error);
      throw error;
    }
  },

  getAlumnoDetails: async () => {
    const { idUsuario } = get();
    console.log("🔍 getAlumnoDetails - idUsuario:", idUsuario);
    
    if (!idUsuario) {
      console.warn("❌ No hay usuario logueado");
      return null;
    }
    
    try {
      const url = `${API_URL_ALUMNO}/usuario/${idUsuario}`;
      console.log("🔍 getAlumnoDetails - URL:", url);
      
      const response = await axios.get(url);
      console.log("🔍 getAlumnoDetails - Response status:", response.status);
      console.log("🔍 getAlumnoDetails - Response data:", response.data);
      
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener detalles del alumno:", error);
      if (axios.isAxiosError(error)) {
        console.error("❌ Status:", error.response?.status);
        console.error("❌ Data:", error.response?.data);
        console.error("❌ URL:", error.config?.url);
      }
      return null;
    }
  },

  getSaldo: async () => {
    console.log("💰 getSaldo - Iniciando...");
    
    // Primero intentar obtener desde el endpoint
    const alumnoDetails = await get().getAlumnoDetails();
    console.log("💰 getSaldo - alumnoDetails:", alumnoDetails);
    
    if (alumnoDetails && alumnoDetails.cuentaCorriente !== undefined) {
      const saldo = alumnoDetails.cuentaCorriente;
      console.log("💰 getSaldo - saldo desde endpoint:", saldo);
      return saldo;
    }
    
    // Fallback: intentar obtener desde getAccountInfo
    console.log("💰 getSaldo - Intentando fallback con getAccountInfo...");
    try {
      const accountInfo = await get().getAccountInfo();
      console.log("💰 getSaldo - accountInfo COMPLETO:", JSON.stringify(accountInfo, null, 2));
      
      // Verificar si está en accountInfo.alumno.saldo
      if (accountInfo?.alumno?.saldo !== undefined) {
        console.log("💰 getSaldo - Saldo encontrado en accountInfo.alumno:", accountInfo.alumno.saldo);
        return accountInfo.alumno.saldo;
      }
      
      // Verificar si está en accountInfo.alumno.cuentaCorriente
      if (accountInfo?.alumno?.cuentaCorriente !== undefined) {
        console.log("💰 getSaldo - Saldo encontrado en accountInfo.alumno.cuentaCorriente:", accountInfo.alumno.cuentaCorriente);
        return accountInfo.alumno.cuentaCorriente;
      }
      
      // Verificar si está en accountInfo.cuentaCorriente (fallback)
      if (accountInfo?.cuentaCorriente !== undefined) {
        console.log("💰 getSaldo - Saldo encontrado en accountInfo.cuentaCorriente:", accountInfo.cuentaCorriente);
        return accountInfo.cuentaCorriente;
      }
      
      // Verificar si está en accountInfo.saldo (fallback)
      if (accountInfo?.saldo !== undefined) {
        console.log("💰 getSaldo - Saldo encontrado en accountInfo.saldo:", accountInfo.saldo);
        return accountInfo.saldo;
      }
      
      // Si no encontramos saldo en ningún lugar, devolver 0 como valor por defecto
      console.log("💰 getSaldo - No se encontró saldo en ninguna ubicación, devolviendo 0");
      return 0;
    } catch (error) {
      console.error("💰 getSaldo - Error en fallback:", error);
    }
    
    console.log("💰 getSaldo - No se pudo obtener saldo");
    return null;
  },

  getNumeroTarjeta: async () => {
    console.log("💳 getNumeroTarjeta - Iniciando...");
    
    // Primero intentar obtener desde el endpoint
    const alumnoDetails = await get().getAlumnoDetails();
    console.log("💳 getNumeroTarjeta - alumnoDetails:", alumnoDetails);
    
    if (alumnoDetails && alumnoDetails.numeroTarjeta) {
      const tarjeta = alumnoDetails.numeroTarjeta;
      console.log("💳 getNumeroTarjeta - tarjeta desde endpoint:", tarjeta ? `****${tarjeta.slice(-4)}` : null);
      return tarjeta;
    }
    
    // Fallback: intentar obtener desde getAccountInfo
    console.log("💳 getNumeroTarjeta - Intentando fallback con getAccountInfo...");
    try {
      const accountInfo = await get().getAccountInfo();
      console.log("💳 getNumeroTarjeta - accountInfo:", accountInfo);
      
      // Verificar si está en accountInfo.alumno.numeroTarjeta
      if (accountInfo?.alumno?.numeroTarjeta) {
        const tarjeta = accountInfo.alumno.numeroTarjeta;
        console.log("💳 getNumeroTarjeta - tarjeta desde accountInfo.alumno:", tarjeta ? `****${tarjeta.slice(-4)}` : null);
        return tarjeta;
      }
      
      // Fallback: verificar si está en accountInfo.numeroTarjeta
      if (accountInfo?.numeroTarjeta) {
        const tarjeta = accountInfo.numeroTarjeta;
        console.log("💳 getNumeroTarjeta - tarjeta desde accountInfo:", tarjeta ? `****${tarjeta.slice(-4)}` : null);
        return tarjeta;
      }
    } catch (error) {
      console.error("💳 getNumeroTarjeta - Error en fallback:", error);
    }
    
    console.log("💳 getNumeroTarjeta - No se pudo obtener tarjeta");
    return null;
  },
}));
