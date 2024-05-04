import { read, WorkBook, WorkSheet, utils } from "xlsx";

export class ExcelFileReader {
    private workBook: WorkBook;

    constructor(data: ArrayBuffer) {
        this.workBook = read(data);
    }

    sheetNames(): string[] {
        return this.workBook.SheetNames;
    }

    workSheet(sheetName: string): ExcelSheet {
        return new ExcelSheet(this.workBook.Sheets[sheetName]);
    }
}

export class ExcelSheet {
    private workSheet: WorkSheet;

    constructor(workSheet: WorkSheet) {
        this.workSheet = workSheet;
    }

    get(col: number, row: number): string | number | undefined {
        const location = utils.encode_cell({ c: col, r: row });
        return this.workSheet[location]?.v;
    }
}
