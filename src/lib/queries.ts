import supabase from "@/services/supabase";

export const getPlayers = async (userId: string) => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("user_id", userId)
    .order("number", { ascending: true });
  if (error) throw error;
  return data;
};
