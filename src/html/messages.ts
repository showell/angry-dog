import he from "he";

import { DB } from "../database/database";

export function message_html(message_id: number): string {
    const sender_id = DB.message_sender.get(message_id)!;
    const sender_name = he.escape(
        DB.user_full_name.get_string(sender_id) ?? "unknown",
    );
    const angry_dog_content_id = DB.message_content.get(message_id)!;
    const content = DB.content_string.get_string(angry_dog_content_id)!;

    return `
<div class="message_sender">${sender_name}</div>
<div>${content}</div>
<hr />
`;
}

export function by_topic_html(channel_topic_id: number): string {
    const message_ids = [
        ...DB.message_to_channel_topic.reverse_get(channel_topic_id),
    ];
    message_ids.sort();

    const topic_id = DB.channel_topic.get_id2(channel_topic_id)!;
    const topic_name = he.escape("> " + DB.topic_name.get_string(topic_id));

    let html = `<h4>${message_ids.length} messages for ${topic_name}</h4>`;

    for (const message_id of message_ids) {
        html += message_html(message_id);
    }

    return html;
}
