import { MessageRow } from "../backend/row_types";

import { DB } from "../backend/database";

export function html(): string {
    const messages = [...DB.message_map.values()];

    messages.sort((m1, m2) => m2.id - m1.id);

    let html = "";

    html += `${messages.length} messages</h4>`;

    for (const message of messages) {
        const mr = new MessageRow(message);
        html += `<div>${mr.sender_name()}</div>`;
        html += `<div>${mr.content()}</div>`;
        html += `<hr>`;
    }

    return html;
}
