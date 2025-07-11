import supabase from "@/services/supabase";

export const getPlayers = async (userId: string) => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
};
