<script lang="ts">
    import { ExcelFileReader, ExcelSheet } from "../lib/ExcelFileReader"; // FIXME

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

    const onDownloadLinkClicked = (event: Event) => {
        let rows = [];
        for (let r = 0; r < 10; r++) {
            rows.push(
                Array.from({ length: 10 }, (v, i) => sheet.get(i, r)).join(","),
            );
        }
        const blob = new Blob([rows.join("\n")], { type: "text/plain" });

        const target = event.target as HTMLAnchorElement;
        target.download = "sample.txt";
        target.href = window.URL.createObjectURL(blob);
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
    <a
        id="download-link"
        href="#"
        on:click={onDownloadLinkClicked}>Download</a
    >
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
