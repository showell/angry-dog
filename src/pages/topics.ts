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

export function html(channel_id: number): string {
    const topic_rows = model.get_topic_rows(channel_id);

    topic_rows.sort((row1, row2) => row1.name().localeCompare(row2.name()));

    let html = STYLE;

    html += `<h4>${topic_rows.length} topics</h4>`;

    for (const topic_row of topic_rows) {
        const topic_messages = `<a href="/topic_messages/${topic_row.topic_id()}">messages</a>`;

        html += `<div class="row">`;
        html += `<div class="name">${topic_row.name()}</div>`;
        html += `<div class="topic_messages">${topic_messages}</div>`;
        html += `</div>`;
    }

    return html;
}
