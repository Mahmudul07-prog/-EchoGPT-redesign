export interface ConnectorDef {
  id: string;
  name: string;
  description: string;
  icon: "cloud" | "notebook" | "message-square" | "code-2" | "pen-tool" | "mail";
}

export const CONNECTOR_DEFS: ConnectorDef[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Reference docs and sheets from your Drive in chat.",
    icon: "cloud",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Pull in pages and databases as chat context.",
    icon: "notebook",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Summarize threads and draft replies without leaving chat.",
    icon: "message-square",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Ask questions about issues, PRs, and repo activity.",
    icon: "code-2",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Bring design context into a conversation.",
    icon: "pen-tool",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Draft and summarize email threads.",
    icon: "mail",
  },
];
