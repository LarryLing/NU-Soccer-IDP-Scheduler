import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import supabase from "@/services/supabase.ts";
import { PlayersContext } from "@/contexts/players-context.tsx";
import { useAuth } from "@/hooks/useAuth";
import type { Player, PlayersContextType } from "@/lib/types";

export function PlayersProvider({ children }: PropsWithChildren) {
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

  const value: PlayersContextType = {
    players,
    insertPlayer,
    updatePlayer,
    deletePlayer,
  };

  return (
    <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>
  );
}
