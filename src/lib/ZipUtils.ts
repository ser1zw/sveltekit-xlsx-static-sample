import JSZip from "jszip";

export class ZipBuilder {
    private jszip;

    constructor() {
        this.jszip = new JSZip();
    }

    addFile(filename: string, content: any) {
        this.jszip.file(filename, content);
        return this;
    }

    async build(): Promise<Blob> {
        return this.jszip.generateAsync({ type: "blob" });
    }
}
