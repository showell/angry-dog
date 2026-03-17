import he from "he";

import { DB } from "../database/database";

function channel_row_html(channel_id: number): string {
    const name = he.escape(DB.channel_name.get_string(channel_id) ?? "unknown");
    const topic_count = DB.channel_topic.get_id2_count(channel_id);

    return `
<div class="channel_row">
    <div class="channel_name">${name}</div>
    <div>
        <a href="/topics/${channel_id}">topics</a>
    </div>
    <div class="channel_count">${topic_count} topics</div>
</div>
`;
}

export function html(): string {
    const channel_ids = DB.channel_name.id_array();

    channel_ids.sort((id1, id2) => {
        const name1 = DB.channel_name.get_string(id1) ?? "unknown";
        const name2 = DB.channel_name.get_string(id2) ?? "unknown";
        return name1.localeCompare(name2);
    });

    let html = `<h4>${channel_ids.length} channels</h4>`;

    for (const channel_id of channel_ids) {
        html += channel_row_html(channel_id);
    }

    return html;
}
