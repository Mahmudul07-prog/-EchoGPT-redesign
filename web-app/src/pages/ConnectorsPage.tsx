import { Plug } from "lucide-react";
import { Cloud, Notebook, MessageSquare, Code2, PenTool, Mail } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Switch } from "../components/Switch";
import { CONNECTOR_DEFS, type ConnectorDef } from "../lib/connectors";
import { useConnectorsStore } from "../store/connectorsStore";
import { useUiStore } from "../store/uiStore";

const ICONS: Record<ConnectorDef["icon"], typeof Cloud> = {
  cloud: Cloud,
  notebook: Notebook,
  "message-square": MessageSquare,
  "code-2": Code2,
  "pen-tool": PenTool,
  mail: Mail,
};

export default function ConnectorsPage() {
  const connected = useConnectorsStore((s) => s.connected);
  const toggleConnector = useConnectorsStore((s) => s.toggleConnector);
  const addToast = useUiStore((s) => s.addToast);

  function handleToggle(def: ConnectorDef) {
    toggleConnector(def.id);
    const willConnect = !connected[def.id];
    addToast(
      willConnect ? `Connected to ${def.name} (demo only — no real account is linked).` : `Disconnected from ${def.name}.`,
      willConnect ? "success" : "default",
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <PageHeader
        title="Connectors"
        description="Link services so EchoGPT can reference their context in chat. Every toggle here is local to this demo — no real OAuth or network call is made."
        icon={<Plug size={20} strokeWidth={1.75} />}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONNECTOR_DEFS.map((def) => {
          const Icon = ICONS[def.icon];
          const isConnected = Boolean(connected[def.id]);
          return (
            <div
              key={def.id}
              className="flex flex-col gap-3 rounded-card border border-border-light bg-surface-light p-5 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.08)] dark:border-border-dark dark:bg-surface-dark"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-white/5 dark:text-brand-400">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <Switch checked={isConnected} onChange={() => handleToggle(def)} label={`Connect ${def.name}`} hideLabel />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-text-light dark:text-text-dark">{def.name}</p>
                <p className="mt-1 text-sm text-text-muted-light dark:text-text-muted-dark">{def.description}</p>
              </div>
              <span
                className={
                  isConnected
                    ? "w-fit rounded-full bg-success-500/10 px-2.5 py-1 text-xs font-medium text-success-500"
                    : "w-fit rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-text-muted-light dark:bg-white/5 dark:text-text-muted-dark"
                }
              >
                {isConnected ? "Connected" : "Not connected"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
