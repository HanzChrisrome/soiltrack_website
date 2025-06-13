import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

type AuthUser = {
  user_id: string;
  user_email: string;
  user_fname: string;
  user_lname: string;
  user_municipality: string;
  user_province: string;
  user_barangay: string;
  role_id: number;
  role_name: string;
};

interface AuthState {
  authUser: AuthUser | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  isLoggingOut: boolean;
  isForgotPassword: boolean;
  isChangingPassword: boolean;

  checkAuth: () => Promise<void>;
  signup: (data: { email: string; password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    password: string,
    token: string,
    email: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: false,
  isForgotPassword: false,
  isChangingPassword: false,
  isLoggingOut: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    console.log("Checking authentication...");

    try {
      const res = await axiosInstance.post("/auth/check");
      const data = res.data;

      console.log("Auth user data:", data);

      const user: AuthUser = {
        user_id: data.user_id,
        user_email: data.user_email,
        user_fname: data.user_fname,
        user_lname: data.user_lname,
        user_municipality: data.user_municipality,
        user_province: data.user_province,
        user_barangay: data.user_barangay,
        role_id: data.role_id,
        role_name: data.roles?.role_name || "User",
      };

      set({ authUser: user });
    } catch (err) {
      console.error("Error during checkAuth:", err);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      await axiosInstance.post("/auth/signup", data);
      toast.success("Signed up successfully!");
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as { message: string }).message ||
        "Failed to sign up!";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (emailOrUsername: string, password: string) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", {
        emailOrUsername,
        password,
      });

      const data = res.data;

      const user: AuthUser = {
        user_id: data.user_id,
        user_email: data.user_email,
        user_fname: data.user_fname,
        user_lname: data.user_lname,
        user_municipality: data.user_municipality,
        user_province: data.user_province,
        user_barangay: data.user_barangay,
        role_id: data.role_id,
        role_name: data.roles?.role_name || "User",
      };

      set({ authUser: user });
      toast.success("Logged in successfully!");
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as { message: string }).message ||
        "Failed to log in!";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  forgotPassword: async (email: string) => {
    set({ isForgotPassword: true });
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset email sent successfully!");
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as { message: string }).message ||
        "Failed to send password reset email!";
      toast.error(errorMessage);
    } finally {
      set({ isForgotPassword: false });
    }
  },

  resetPassword: async (password: string, token: string, email: string) => {
    set({ isChangingPassword: true });

    try {
      await axiosInstance.post("/auth/reset-password", {
        password,
        token,
        email,
      });
      toast.success("Password changed successfully!");
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as { message: string }).message ||
        "Failed to change password!";
      toast.error(errorMessage);
    } finally {
      set({ isChangingPassword: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    toast.loading("Logging out...");

    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.dismiss();
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Error during logout:", err);
      toast.dismiss();
      toast.error("Failed to log out!");
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
