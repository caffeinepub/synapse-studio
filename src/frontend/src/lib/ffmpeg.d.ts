// Ambient module declarations for @ffmpeg packages (loaded dynamically at runtime)
declare module "@ffmpeg/ffmpeg" {
  export class FFmpeg {
    loaded: boolean;
    load(options?: {
      coreURL?: string;
      wasmURL?: string;
      workerURL?: string;
    }): Promise<void>;
    writeFile(name: string, data: Uint8Array | string): Promise<void>;
    readFile(name: string): Promise<Uint8Array>;
    exec(args: string[]): Promise<number>;
    on(
      event: "log" | "progress",
      callback: (data: { message?: string; progress?: number }) => void,
    ): void;
    off(event: "log" | "progress", callback: () => void): void;
    terminate(): void;
  }
}

declare module "@ffmpeg/util" {
  export function fetchFile(
    data: string | File | Blob | ArrayBuffer | Uint8Array,
  ): Promise<Uint8Array>;
  export function toBlobURL(url: string, mimeType: string): Promise<string>;
}
