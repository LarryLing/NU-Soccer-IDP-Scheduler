import type { Player, UsePlayersReturn } from "@/lib/types";
import supabase from "@/services/supabase.ts";
import { useState, useCallback, useEffect } from "react";

export const usePlayers = (): UsePlayersReturn => {
  const [players, setPlayers] = useState<Player[]>([]);

  const insertPlayer = useCallback(async (player: Player) => {
    const { error } = await supabase.from("players").insert(player);
    if (error) {
      console.error("Error adding player", error);
      throw error;
    }
  }, []);

  const updatePlayer = useCallback(async (player: Player) => {
    const { error } = await supabase.from("players").update(player).eq("id", player.id);
    if (error) {
      console.error("Error updating player", error);
      throw error;
    }
  }, []);

  const deletePlayer = useCallback(async (playerId: string) => {
    const { error } = await supabase.from("players").delete().eq("id", playerId);
    if (error) {
      console.error("Error deleting player", error);
    }
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data: players, error } = await supabase
        .from("players")
        .select("*")
        .order("number", { ascending: true });

      if (error || !players) {
        console.error("Error fetching players");
        return;
      }

      setPlayers(players);
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    async function setSupabaseAuth() {
      await supabase.realtime.setAuth();
    }

    setSupabaseAuth();

    const playersChannel = supabase.channel(`players`);

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
              player.id === message.payload.id ? (message.payload as Player) : player,
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
          setPlayers((prev) => prev.filter((player) => player.id !== message.payload.id));
        },
      )
      .subscribe();

    return () => {
      playersChannel.unsubscribe();
    };
  }, []);

  return { players, insertPlayer, updatePlayer, deletePlayer };
};
