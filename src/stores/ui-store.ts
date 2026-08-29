import { create } from "zustand";

interface UIStore {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  drawerOpen: false,
  setDrawerOpen: (open) => set({ drawerOpen: open }),
}));
