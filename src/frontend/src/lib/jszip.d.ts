// Ambient module declaration for jszip (not installed as a package)
declare module "jszip" {
  interface JSZipObject {
    async(type: "base64"): Promise<string>;
  }
  interface JSZip {
    file(
      name: string,
      content: string | Uint8Array,
      options?: { base64?: boolean },
    ): JSZip;
    generateAsync(options: { type: "blob" }): Promise<Blob>;
  }
  const JSZip: {
    new (): JSZip;
  };
  export default JSZip;
}
