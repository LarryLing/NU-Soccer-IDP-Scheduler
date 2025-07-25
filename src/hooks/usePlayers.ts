import type { Player, UsePlayersReturn } from "@/lib/types";
import supabase from "@/services/supabase.ts";
import { useState, useCallback, useEffect } from "react";

export const usePlayers = (): UsePlayersReturn => {
  const [players, setPlayers] = useState<Player[]>([]);

  const insertPlayer = useCallback(async (player: Player) => {
    const { error } = await supabase.from("players").insert(player).select();
    if (error) {
      console.error("Error adding player", error);
      throw error;
    }
  }, []);

  const updatePlayer = useCallback(async (player: Player) => {
    const { error } = await supabase.from("players").update(player).eq("id", player.id);
    if (error) {
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
    const playersChannel = supabase
      .channel("players")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPlayers((prev) => [...prev, payload.new as Player]);
          } else if (payload.eventType === "UPDATE") {
            setPlayers((prev) =>
              prev.map((player) =>
                player.id === payload.new.id ? (payload.new as Player) : player,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setPlayers((prev) => prev.filter((player) => player.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    const heartbeat = setInterval(() => {
      playersChannel.send({
        type: "broadcast",
        event: "heartbeat",
        payload: { timestamp: Date.now() },
      });
    }, 90000);

    return () => {
      clearInterval(heartbeat);
      playersChannel.unsubscribe();
    };
  }, []);

  return { players, insertPlayer, updatePlayer, deletePlayer };
};
