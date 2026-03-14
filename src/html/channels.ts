import he from "he";

import type { ChannelRow } from "../backend/row_types";

import * as model from "../backend/model";

const STYLE = `
<style>
    .row {
        display: flex;
    }

    .name {
        width: 300px;
    }
</style>
`;

function channel_row_html(channel_row: ChannelRow): string {
    const channel_id = channel_row.id();
    const name = he.escape(channel_row.name());

    return `
<div class="row">
    <div class="name">${name}</div>
    <div>
        <a href="/topics/${channel_id}">topics</a>
    </div>
</div>
`;
}

export function html(): string {
    const channel_rows = model.get_channel_rows();

    channel_rows.sort((row1, row2) => row1.name().localeCompare(row2.name()));

    let html = STYLE;

    html += `<h4>${channel_rows.length} channels</h4>`;

    for (const channel_row of channel_rows) {
        html += channel_row_html(channel_row);
    }

    return html;
}
