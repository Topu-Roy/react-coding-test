import { InputsForAPI } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type userStoreType = {
  obj: InputsForAPI;
  setObj: ({ name, sectorId, acceptedTerms }: InputsForAPI) => void;
};

const initialObj: InputsForAPI = {
  name: "",
  sectorId: "",
  acceptedTerms: false,
};

export const useUserStore = create<
  userStoreType,
  [["zustand/persist", unknown]]
>(
  persist(
    (set) => ({
      obj: initialObj,
      setObj: (obj) => set(() => ({ obj })),
    }),
    {
      name: "user",
    }
  )
);
