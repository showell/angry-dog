import he from "he";

import type { TopicRow } from "../backend/row_types";

import * as model from "../backend/model";

function topic_row_html(topic_row: TopicRow): string {
    const topic_id = topic_row.topic_id();
    const name = he.escape(topic_row.name());
    const count = topic_row.num_messages();

    return `
<div class="topic_row">
    <div class="topic_name">${name}</div>
    <div>
        <a href="/topic_messages/${topic_id}">messages</a>
    </div>
    <div class="topic_count">${count} messages</div>
</div>
`;
}

export function html(channel_id: number): string {
    const topic_rows = model.get_topic_rows(channel_id);

    topic_rows.sort((row1, row2) => row1.name().localeCompare(row2.name()));

    const channel_name = he.escape("#" + model.channel_name_for(channel_id));

    let html = `<h4>${topic_rows.length} topics for ${channel_name}</h4>`;

    for (const topic_row of topic_rows) {
        html += topic_row_html(topic_row);
    }

    return html;
}
