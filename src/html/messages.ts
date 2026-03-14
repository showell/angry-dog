import he from "he";

import { DB } from "../backend/database";
import * as model from "../backend/model";
import { MessageRow } from "../backend/row_types";

const STYLE = `
<style>
    .sender {
        font-weight: bold;
    }
</style>
`;

export function message_html(message_row: MessageRow): string {
    const sender_name = he.escape(message_row.sender_name());
    const content = message_row.content();
    return `
<div class="sender">${sender_name}</div>
<div>${content}</div>
<hr />
`;
}

export function html(): string {
    const messages = [...DB.message_map.values()];

    messages.sort((m2, m1) => m1.id - m2.id);

    let html = STYLE;

    html += `${messages.length} messages (reverse cron)</h4>`;

    for (const message of messages) {
        const message_row = new MessageRow(message);
        html += message_html(message_row);
    }

    return html;
}

export function by_topic_html(topic_id: number): string {
    const messages = model.messages_for_topic(topic_id);

    let html = STYLE;

    html += `${messages.length} messages</h4>`;

    for (const message of messages) {
        const message_row = new MessageRow(message);
        html += message_html(message_row);
    }

    return html;
}
