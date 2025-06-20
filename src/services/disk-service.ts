import { execCommand } from "../utils/sh";

export interface Disk {
  device: string;
  size: string;
  model: string;
}

export class DiskService {
  static async getDisks(): Promise<Disk[]> {
    const { stdout } = await execCommand(
      `lsblk -J -o NAME,TYPE,SIZE,MODEL | jq '[.blockdevices[] | select(.type == "disk" and .model != null and .model != "")]' -M`
    );
    return JSON.parse(stdout).map((disk: any) => ({
        device: `/dev/${disk.name}`,
        size: disk.size,
        model: disk.model
    }))
  }
}
