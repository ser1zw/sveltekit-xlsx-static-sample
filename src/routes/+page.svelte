<script lang="ts">
    import { ExcelFileReader, ExcelSheet } from "../lib/ExcelFileReader"; // FIXME
    import { ZipBuilder } from "../lib/ZipUtils";

    export let sheetNames: string[] = [];
    export let sheet: ExcelSheet;

    const onFileUpload = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        const fileList = target.files;
        if (!fileList) {
            console.log("fileList is null");
            return;
        }

        const buffer = await fileList[0].arrayBuffer();
        const reader = new ExcelFileReader(buffer);

        sheetNames = reader.sheetNames();
        sheet = reader.workSheet(sheetNames[0]);
    };

    const onDownloadLinkClicked = async (event: Event) => {
        let rows = [];
        for (let r = 0; r < 10; r++) {
            rows.push(
                Array.from({ length: 10 }, (v, i) => sheet.get(i, r)).join(","),
            );
        }
        const zipBuilder = new ZipBuilder();
        const blob = await zipBuilder
            .addFile("README.txt", "Extracted from uploaded excel sheet\n")
            .addFile("sample.txt", rows.join("\n"))
            .build();

        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = URL.createObjectURL(blob);
        link.download = "sample.zip";
        link.click();
        document.body.removeChild(link);
    };
</script>

<input id="uploaded-file" type="file" on:change={onFileUpload} />

<h2>Sheet name</h2>
<ul>
    {#each sheetNames as sheetName}
        <li>{sheetName}</li>
    {/each}
</ul>

<h2>Values of sheet[0]</h2>
{#if sheet}
    <table id="values">
        {#each Array(10) as _, r}
            <tr>
                {#each Array(10) as _, c}
                    <td>{sheet.get(c, r) || "\u00A0"}</td>
                {/each}
            </tr>
        {/each}
    </table>
    <input type="button" value="Download" on:click={onDownloadLinkClicked} />
{/if}

<style>
    table,
    td {
        border-collapse: collapse;
        border: 1px solid;
    }
    td {
        min-width: 100px;
    }
</style>
