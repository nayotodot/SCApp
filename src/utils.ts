export const SCREEN_WIDTH: number = 1136;
export const SCREEN_HEIGHT: number = 640;

export const END_POINT_URL: string = "https://shinycolors.enza.fun";

export const isWindows: boolean = process.platform === "win32";
export const isMac: boolean = process.platform === "darwin";
export const isDevMode: boolean = /[\\/]electron/.test( process.execPath );
