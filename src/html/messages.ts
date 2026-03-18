import he from "he";

import { DB } from "../database/database";

function get_topic_name(channel_topic_id: number): string {
    const topic_id = DB.channel_topic.get_id2(channel_topic_id)!;
    return DB.topic_name.get_string(topic_id) ?? "unknown";
}

function get_message_ids(channel_topic_id: number): number[] {
    return [...DB.message_to_channel_topic.reverse_get(channel_topic_id)];
}

function get_sender_name(message_id: number): string {
    const sender_id = DB.message_sender.get(message_id)!;
    return DB.user_full_name.get_string(sender_id) ?? "unknown";
}

function get_content(message_id: number): string {
    const angry_dog_content_id = DB.message_content.get(message_id)!;
    return DB.content_string.get_string(angry_dog_content_id)!;
}

export function message_html(message_id: number): string {
    const sender_name = get_sender_name(message_id);
    const safe_html_content = get_content(message_id);

    return `
<div class="message_sender">${he.escape(sender_name)}</div>
<div>${safe_html_content}</div>
<hr />
`;
}

export function by_topic_html(channel_topic_id: number): string {
    const message_ids = get_message_ids(channel_topic_id);
    message_ids.sort();

    const topic_name = get_topic_name(channel_topic_id);

    let html = `<h4>${message_ids.length} messages for ${"> " + he.escape(topic_name)}</h4>`;

    for (const message_id of message_ids) {
        html += message_html(message_id);
    }

    return html;
}
