import he from "he";

import { MessageRow } from "../backend/row_types";

import { DB } from "../backend/database";

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

    messages.sort((m1, m2) => m1.id - m2.id);

    let html = STYLE;

    html += `${messages.length} messages</h4>`;

    for (const message of messages) {
        const message_row = new MessageRow(message);
        html += message_html(message_row);
    }

    return html;
}
