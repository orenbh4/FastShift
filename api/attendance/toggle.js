import { createSupabaseAdminClient } from "../_supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const supabase = createSupabaseAdminClient();

    const { data: openRecord, error: fetchError } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .is("clock_out", null)
      .maybeSingle();

    if (fetchError) {
      return res.status(400).json({ error: fetchError.message });
    }

    if (openRecord) {
      const { data, error } = await supabase
        .from("attendance")
        .update({ clock_out: new Date().toISOString() })
        .eq("id", openRecord.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({
        message: "Clocked out successfully",
        attendance: data,
      });
    }

    const { data, error } = await supabase
      .from("attendance")
      .insert({
        user_id: userId,
        clock_in: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Clocked in successfully",
      attendance: data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
