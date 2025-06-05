import { create } from "zustand";
import safeAsync from "../utils/safeAsync";
import { UserSummary } from "../models/readingStoreModels";
import { getUserSummary } from "../service/userPageService";

interface UserState {
  isGettingUsers: boolean;

  userSummary: UserSummary[] | null;

  //FUNCTIONS
  fetchUserSummary: (municipality: string, province: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  isGettingUsers: false,
  userSummary: null,

  fetchUserSummary: async (municipality, province) => {
    const data = await safeAsync(getUserSummary(municipality, province), []);
    set({ userSummary: data });
  },
}));
