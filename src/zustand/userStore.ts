import { create } from "zustand";
import { persist } from "zustand/middleware";

type userStoreType = {
  id: string;
  setId: (id: string) => void;
};

export const useUserStore = create<
  userStoreType,
  [["zustand/persist", unknown]]
>(
  persist(
    (set) => ({
      id: "",
      setId: (id) => set(() => ({ id })),
    }),
    {
      name: "userId",
    }
  )
);
