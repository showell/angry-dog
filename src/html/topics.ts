import he from "he";
import { DB } from "../database/database";
import { alpha_sort } from "../util/sort";

function get_channel_name(channel_id: number): string {
    return DB.channel_name.get_string(channel_id) ?? "unknown";
}
function get_channel_topic_ids(channel_id: number): number[] {
    return DB.channel_topic.get_ids_from_id1(channel_id);
}

function get_topic_name_from_channel_topic_id(
    channel_topic_id: number,
): string {
    const topic_id = DB.channel_topic.get_id2(channel_topic_id)!;
    return DB.topic_name.get_string(topic_id) ?? "unknown";
}

function get_message_count(channel_topic_id: number): number {
    return DB.message_to_channel_topic.reverse_get(channel_topic_id).size;
}

function topic_row_html(channel_topic_id: number): string {
    const name = get_topic_name_from_channel_topic_id(channel_topic_id);
    const count = get_message_count(channel_topic_id);

    return `
<div class="topic_row">
    <div class="topic_name">${he.escape(name)}</div>
    <div>
        <a href="/topic_messages/${channel_topic_id}">messages</a>
    </div>
    <div class="topic_count">${count} messages</div>
</div>
`;
}

export function html(channel_id: number): string {
    const channel_name = get_channel_name(channel_id);
    const channel_topic_ids = get_channel_topic_ids(channel_id);

    alpha_sort(channel_topic_ids, get_topic_name_from_channel_topic_id);

    let html = `<h4>${channel_topic_ids.length} topics for #${he.escape(channel_name)}</h4>`;

    for (const channel_topic_id of channel_topic_ids) {
        html += topic_row_html(channel_topic_id);
    }

    return html;
}
