import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CONNECTOR_DEFS } from "../lib/connectors";

interface ConnectorsState {
  connected: Record<string, boolean>;
  toggleConnector: (id: string) => void;
}

const initialConnected: Record<string, boolean> = Object.fromEntries(
  CONNECTOR_DEFS.map((c, i) => [c.id, i === 0]),
);

export const useConnectorsStore = create<ConnectorsState>()(
  persist(
    (set) => ({
      connected: initialConnected,
      toggleConnector: (id) =>
        set((state) => ({ connected: { ...state.connected, [id]: !state.connected[id] } })),
    }),
    { name: "echogpt-connectors-store" },
  ),
);
