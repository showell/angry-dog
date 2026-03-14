import he from "he";

import type { TopicRow } from "../backend/row_types";

import * as model from "../backend/model";

const STYLE = `
<style>
    .topic_row {
        display: flex;
    }

    .topic_name {
        width: 300px;
    }
</style>
`;

function topic_row_html(topic_row: TopicRow): string {
    const topic_id = topic_row.topic_id();
    const name = he.escape(topic_row.name());

    return `
<div class="topic_row">
    <div class="topic_name">${name}</div>
    <div>
        <a href="/topic_messages/${topic_id}">messages</a>
    </div>
</div>
`;
}

export function html(channel_id: number): string {
    const topic_rows = model.get_topic_rows(channel_id);

    topic_rows.sort((row1, row2) => row1.name().localeCompare(row2.name()));

    let html = STYLE;

    html += `<h4>${topic_rows.length} topics</h4>`;

    for (const topic_row of topic_rows) {
        html += topic_row_html(topic_row);
    }

    return html;
}
