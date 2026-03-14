import * as model from "../backend/model";

const STYLE = `
<style>
    .row {
        display: flex;
    }

    .name {
        width: 300px;
        color: green;
    }
</style>
`

export function html(): string {
    const channel_rows = model.get_channel_rows();

    channel_rows.sort((row1, row2) => row1.name().localeCompare(row2.name()));

    let html = STYLE;

    html += `<h4>${channel_rows.length} channels</h4>`;

    for (const channel_row of channel_rows) {
        const topics_link = `<a href="/topics/${channel_row.id()}">topics</a>`;

        html += `<div class="row">`;
        html += `<div class="name">${channel_row.name()}</div>`;
        html += `<div class="topics_link">${topics_link}</div>`;
        html += `</div>`;
    }

    return html;
}
