import { Request, Response } from "express";
import supabase from "../lib/supabase";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  console.log("Received signup request with:", username, email, password);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      res.status(400).json({ message: error.message });
      console.error("Error during signup:", error);
      return;
    }
    const { user } = data;
    const { error: insertError } = await supabase
      .from("users")
      .upsert({
        userId: user?.id,
        userName: username,
        userEmail: email,
        userRole: "Admin",
      })
      .single();
    if (insertError) {
      res.status(400).json({ message: insertError.message });
      console.error("Error during signup:", insertError);
      return;
    }
    res.status(200).json({
      message:
        "Signed up successfully! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { emailOrUsername, password } = req.body;

  console.log("Received login request with:", emailOrUsername, password);

  try {
    const isEmail = emailOrUsername.includes("@");

    const { data: userRoleData, error: roleError } = await supabase
      .from("users")
      .select("userId, userRole, userEmail, userName")
      .eq(isEmail ? "userEmail" : "userName", emailOrUsername)
      .single();

    if (roleError || !userRoleData) {
      console.error("Error or no user found:", roleError);
      res.status(400).json({ message: "Invalid email or user does not exist" });
      return;
    }

    if (userRoleData.userRole !== "Admin") {
      console.log("User is not an admin:", emailOrUsername);
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userRoleData.userEmail,
      password,
    });

    if (error) {
      res.status(400).json({ message: error.message });
      console.error("Error during login:", error);
      return;
    }

    const { user } = data;
    console.log("User logged in:", user);

    res.status(200).json({
      id: user.id,
      email: user.email,
      username: userRoleData.userName,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      res.status(401).json({ message: error.message });
      return;
    }

    const { user } = data;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("userName, userEmail")
      .eq("userId", user?.id)
      .single();

    if (userError) {
      res.status(400).json({ message: userError.message });
      console.error("Error during checkAuth:", userError);
      return;
    }

    res.status(200).json({
      id: user?.id,
      email: userData?.userEmail,
      username: userData?.userName,
    });
    
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const redirectUrl = `http://localhost:5173/reset-password?email=${encodeURIComponent(
      email
    )}`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      res.status(400).json({ message: error.message });
      console.error("Error during forgot password:", error);
      return;
    }

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { password, token, email } = req.body;
    const { error: tokenError } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: "recovery",
    });

    if (tokenError) {
      res.status(400).json({ message: tokenError.message });
      console.error("Error during reset password:", tokenError);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      res.status(400).json({ message: updateError.message });
      console.error("Error during reset password:", updateError);
      return;
    }

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error during reset password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      res.status(400).json({ message: error.message });
      console.error("Error during logout:", error);
      return;
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
