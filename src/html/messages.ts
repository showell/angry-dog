import he from "he";

import { DB } from "../backend/database";
import * as model from "../backend/model";
import { MessageRow } from "../backend/row_types";

export function message_html(message_row: MessageRow): string {
    const sender_name = he.escape(message_row.sender_name());
    const content = message_row.content();
    return `
<div class="message_sender">${sender_name}</div>
<div>${content}</div>
<hr />
`;
}

export function by_topic_html(topic_id: number): string {
    const messages = model.messages_for_topic(topic_id);
    const topic_name = he.escape("> " + model.topic_name_for(topic_id));

    let html = `<h4>${messages.length} messages for ${topic_name}</h4>`;

    for (const message of messages) {
        const message_row = new MessageRow(message);
        html += message_html(message_row);
    }

    return html;
}
