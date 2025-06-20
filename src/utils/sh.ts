import { Command } from "@tauri-apps/plugin-shell";

export function execCommand(command: string) {
  return Command.create("exec-sh", ["-c", command]).execute();
}