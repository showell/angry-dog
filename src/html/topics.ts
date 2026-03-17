import he from "he";

import { DB } from "../database/database";

function topic_name_from_channel_topic_id(channel_topic_id: number): string {
    const topic_id = DB.channel_topic.get_id2(channel_topic_id)!;
    return DB.topic_name.get_string(topic_id) ?? "unknown";
}

function topic_row_html(channel_topic_id: number): string {
    const name = he.escape(topic_name_from_channel_topic_id(channel_topic_id));
    const count =
        DB.message_to_channel_topic.reverse_get(channel_topic_id).size;

    return `
<div class="topic_row">
    <div class="topic_name">${name}</div>
    <div>
        <a href="/topic_messages/${channel_topic_id}">messages</a>
    </div>
    <div class="topic_count">${count} messages</div>
</div>
`;
}

export function html(channel_id: number): string {
    const channel_topic_ids = DB.channel_topic.get_ids_from_id1(channel_id);

    channel_topic_ids.sort((channel_topic_id1, channel_topic_id2) => {
        const name1 = topic_name_from_channel_topic_id(channel_topic_id1);
        const name2 = topic_name_from_channel_topic_id(channel_topic_id2);
        return name1.localeCompare(name2);
    });

    const channel_name = he.escape(
        "#" + DB.channel_name.get_string(channel_id),
    );

    let html = `<h4>${channel_topic_ids.length} topics for ${channel_name}</h4>`;

    for (const channel_topic_id of channel_topic_ids) {
        html += topic_row_html(channel_topic_id);
    }

    return html;
}
