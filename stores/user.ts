import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8080/api/usuarios";

interface Alumno {
  idAlumno: number;
  numeroTarjeta: string;
  dniFrente: string;
  dniFondo: string;
  tramite: string;
  cuentaCorriente: string;
}

interface UserStore {
  mail: string | null;
  nickname: string | null;
  clave: string | null;
  idUsuario: number | null;
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
}

export const useUserStore = create<UserStore>((set, get) => ({
  mail: null,
  nickname: null,
  clave: null,
  idUsuario: null,

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
    set({ mail: null, nickname: null, clave: null });
  },

  login: async (mail, password) => {
    try {
      const response = await axios.post(`http://localhost:8080/auth/login`, {
        mail,
        password,
      });
      set({ mail: mail });
      get().updateUserId(mail);
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
}));
