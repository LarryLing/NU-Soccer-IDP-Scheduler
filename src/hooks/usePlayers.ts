import type { Player, UsePlayersReturn } from "@/lib/types";
import supabase from "@/services/supabase.ts";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "./useAuth.ts";

export const usePlayers = (): UsePlayersReturn => {
  const { user } = useAuth();

  const [players, setPlayers] = useState<Player[]>([]);

  const insertPlayer = useCallback(async (player: Player) => {
    const { error } = await supabase.from("players").insert(player);
    if (error) {
      console.error("Error adding player", error);
      return;
    }
  }, []);

  const updatePlayer = useCallback(async (player: Player) => {
    const { error } = await supabase
      .from("players")
      .update(player)
      .eq("id", player.id);
    if (error) {
      console.error("Error updating player", error);
    }
  }, []);

  const deletePlayer = useCallback(async (playerId: string) => {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerId);
    if (error) {
      console.error("Error deleting player", error);
    }
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!user) return;
      const { data: players, error } = await supabase
        .from("players")
        .select("*")
        .eq("user_id", user.id)
        .order("number", { ascending: true });
      if (error) console.error("Error fetching players");
      setPlayers(players || []);
    };
    fetchPlayers();
  }, [user]);

  useEffect(() => {
    async function setSupabaseAuth() {
      await supabase.realtime.setAuth();
    }

    if (!user) return;

    setSupabaseAuth();

    const playersChannel = supabase.channel(`players:${user.id}`);

    playersChannel
      .on(
        "broadcast",
        {
          event: "INSERT",
        },
        (message) => {
          setPlayers((prev) => [...prev, message.payload as Player]);
        },
      )
      .on(
        "broadcast",
        {
          event: "UPDATE",
        },
        (message) => {
          setPlayers((prev) =>
            prev.map((player) =>
              player.id === message.payload.id
                ? (message.payload as Player)
                : player,
            ),
          );
        },
      )
      .on(
        "broadcast",
        {
          event: "DELETE",
        },
        (message) => {
          setPlayers((prev) =>
            prev.filter((player) => player.id !== message.payload.id),
          );
        },
      )
      .subscribe();

    return () => {
      playersChannel.unsubscribe();
    };
  }, [user]);

  return { players, insertPlayer, updatePlayer, deletePlayer };
};
