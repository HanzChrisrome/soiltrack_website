import { create } from "zustand";
import { UserSummary } from "../../models/readingStoreModels";
import toast from "react-hot-toast";
import { getUserSummary } from "../../service/AdminService/userPageService";

interface UserState {
  //DATA
  userSummary: UserSummary[] | null;

  //FUNCTIONS
  fetchUserSummary: (municipality: string, province: string) => Promise<void>;
  insertUserAccount: (
    userFname: string,
    userLname: string,
    userEmail: string,
    polygonCoords: { lat: number; lng: number }[][]
  ) => Promise<void>;

  //LOADING STATES
  isInsertingUser?: boolean;
  isGettingUsers: boolean;

  //FLAGS
  hasFetchedUserSummary?: boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  userSummary: null,

  //LOADING STATES
  isGettingUsers: false,
  isInsertingUser: false,

  //FLAGS
  hasFetchedUserSummary: false,

  fetchUserSummary: async (municipality, province) => {
    const state = get();
    if (state.hasFetchedUserSummary) return;

    set({ isGettingUsers: true });
    const data = await getUserSummary(municipality, province);
    set({
      userSummary: data,
      isGettingUsers: false,
      hasFetchedUserSummary: true,
    });
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
