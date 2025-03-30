export interface SystemConfig {
  lang?: string;
  keymap?: string
}

declare module './config' {
  interface Config {
    system?: SystemConfig;
  }
}