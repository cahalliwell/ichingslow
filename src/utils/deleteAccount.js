import { supabase } from "../lib/supabaseClient";

export async function deleteAccount() {
  console.log("Attempting to delete account via Edge Function...");
  try {
    const { data, error } = await supabase.functions.invoke("delete-account", {
      method: "POST",
    });

    if (error) {
      console.error("Edge Function error", error);
      return { success: false, error: error.message || "Failed to delete account." };
    }

    if (data?.error) {
      console.error("Delete account failed", data.error);
      const errorMessage =
        typeof data.error === "string" ? data.error : "Unable to delete your account.";
      return { success: false, error: errorMessage };
    }

    if (!data?.message) {
      console.error("Delete account unexpected response", data);
      return { success: false, error: "Unexpected response from the server." };
    }

    await supabase.auth.signOut();
    console.log("Account deleted and user signed out");
    return { success: true };
  } catch (err) {
    console.error("Delete account exception", err);
    return { success: false, error: err?.message || "Unable to delete your account." };
  }
}
