import express, { Request, Response } from "express";
import supabase from "../lib/supabase";
import { errorLog, infoLog } from "../utils/logger";

const router = express.Router();

router.get("/user-summary", async (req: Request, res: Response) => {
  const { municipality, province } = req.query;
  infoLog("Received user summary request");

  if (!municipality || !province) {
    res.status(400).json({ message: "Missing municipality or province" });
    return;
  }

  const { data, error } = await supabase.rpc("get_users_summary", {
    target_municipality: municipality,
    target_province: province,
  });

  if (error) {
    errorLog("Error fetching user summary:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  res.json(data);
});

router.post("/insert-user", async (req: Request, res: Response) => {
  const { userFname, userLname, userEmail, polygonCoords, polygonAddresses } =
    req.body;

  //CHECK IF THE USER ALREADY EXISTS
  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("user_id")
    .eq("user_email", userEmail)
    .single();

  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  //INSERT THE USER
  const { data: account, error } = await supabase.auth.admin.createUser({
    email: userEmail,
    password: "Password123",
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating user account:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  const { data: insertedUser, error: insertError } = await supabase
    .from("users")
    .insert({
      user_id: account.user.id,
      user_fname: userFname,
      user_lname: userLname,
      user_email: userEmail,
    });

  if (insertError) {
    errorLog("Error inserting user:", insertError);
    res.status(500).json({ message: insertError.message });
    return;
  }

  const { user } = account;
  const userId = user?.id;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const plots = polygonCoords.map(
    (coords: { lat: number; lng: number }[], index: number) => {
      const plotLetter = alphabet[index] || `_${index}`;
      const address = polygonAddresses[index] || "";

      return {
        user_id: userId,
        plot_name: `${userFname} Plot ${plotLetter}`,
        polygons: coords,
        isValveOn: false,
        soil_type: "Unknown",
        plot_address: address,
        valve_pin: 0,
        valve_tagging: "",
        irrigation_type: "",
      };
    }
  );

  const { error: insertPlotsError } = await supabase
    .from("user_plots")
    .insert(plots);

  if (insertPlotsError) {
    errorLog("Error inserting user plots:", insertPlotsError);
    res.status(500).json({ message: insertPlotsError.message });
    return;
  }

  infoLog("User inserted successfully:", userFname, userLname);
});

export default router;
