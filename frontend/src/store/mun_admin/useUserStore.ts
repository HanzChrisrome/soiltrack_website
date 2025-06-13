import { create } from "zustand";
import { UserSummary } from "../../models/readingStoreModels";
import {
  getUserSummary,
  insertUserAccount,
} from "../../service/userPageService";
import { getAxiosErrorMessage } from "../../utils/AxiosError";
import toast from "react-hot-toast";

interface UserState {
  isGettingUsers: boolean;

  userSummary: UserSummary[] | null;

  fetchUserSummary: (municipality: string, province: string) => Promise<void>;

  insertUserAccount: (
    userFname: string,
    userLname: string,
    userEmail: string,
    polygonCoords: { lat: number; lng: number }[][]
  ) => Promise<void>;

  //LOADING STATES
  isInsertingUser?: boolean;
}

export const useUserStore = create<UserState>((set) => ({
  isGettingUsers: false,
  userSummary: null,

  isInsertingUser: false,

  fetchUserSummary: async (municipality, province) => {
    // const data = await safeAsync(getUserSummary(municipality, province), []);
    // set({ userSummary: data });
  },

  insertUserAccount: async (userFname, userLname, userEmail, polygonCoords) => {
    // try {
    //   set({ isInsertingUser: true });
    //   await insertUserAccount(userFname, userLname, userEmail, polygonCoords);
    // } catch (error: unknown) {
    //   const message = getAxiosErrorMessage(error);
    //   toast.error(message || "Failed to insert user!", {
    //     position: "bottom-right",
    //   });
    // } finally {
    //   set({ isInsertingUser: false });
    // }
  },
}));
