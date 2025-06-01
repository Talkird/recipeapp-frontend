import { create } from "zustand";

interface UserStore {
  isAlumno: boolean;
  setIsAlumno: (isAlumno: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  isAlumno: false,
  setIsAlumno: (isAlumno) => set({ isAlumno }),
}));

export default useUserStore;
