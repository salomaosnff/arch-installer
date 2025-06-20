import { execCommand } from "../utils/sh";

export interface Device {
  device: string;
  type: "wifi" | "ethernet";
  state: "connected" | "disconnected" | "unavailable";
  connection?: string;
}

export interface Network {
  connected: boolean;
  bssid: string;
  ssid?: string;
  channel: number;
  speed: string;
  signal: number;
  security: string[];
}



export class NetworkManager {
  static async getDevices(): Promise<Device[]> {
    const { stdout } = await execCommand("nmcli -t -c no device status");
    const rowRegex =
      /^(?<device>.+?):(?<type>.+?):(?<state>.+?):(?<connection>.*?)$/gim;
    const devices: Device[] = [];

    for (const { groups } of stdout.matchAll(rowRegex)) {
      if (!groups) continue;
      if (groups.type !== "wifi" && groups.type !== "ethernet") continue;

      devices.push({
        device: groups.device,
        type: groups.type,
        state: groups.state,
        connection: groups.connection,
      } as Device);
    }

    return devices;
  }

  static async scanWifi(): Promise<Network[]> {
    const { stdout } = await execCommand("nmcli -t -c no dev wifi list");
    const rowRegex =
      /^(?:(?<connected>\*?)\s*:)?(?<bssid>(?:[a-f\d]{2}\\:){5}[a-f\d]{2}):(?<ssid>.*?):(?:.+?):(?<channel>\d+):(?<speed>.+?):(?<signal>\d+?):(?:.+?):(?<security>.*?)$/gim;
    const networks: Network[] = [];

    for (const { groups } of stdout.matchAll(rowRegex)) {
      if (!groups) continue;

      networks.push({
        connected: groups.connected === "*",
        bssid: groups.bssid,
        ssid: groups.ssid.replace(/\\:/g, ":") || undefined,
        channel: Number(groups.channel),
        speed: groups.speed,
        signal: Number(groups.signal),
        security: groups.security ? groups.security.split(" ") : [],
      } as Network);
    }

    return networks;
  }

  static async hasInternet(): Promise<boolean> {
    const { stdout } = await execCommand(
      "(nmcli -c no -t -f STATE g | grep -e '^connected$' && ping -n -c 1 1.1.1.1) > /dev/null && echo 1 || echo 0"
    );
    return stdout.trim() === "1";
  }

  static async wifiConnect(ssid: string, password?: string): Promise<void> {
    await execCommand(`nmcli connection delete "${ssid}"`);

    const command = password
      ? `nmcli dev wifi connect "${ssid}" password "${password}"`
      : `nmcli dev wifi connect "${ssid}"`;

    const { stderr } = await execCommand(command);

    if (stderr) {
      throw new Error(stderr.trim());
    }
  }
}
