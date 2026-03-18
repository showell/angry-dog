import he from "he";
import { DB } from "../database/database";
import { alpha_sort } from "../util/sort";

function get_channel_ids(): number[] {
    return DB.channel_name.id_array();
}

function get_channel_name(channel_id: number): string {
    return DB.channel_name.get_string(channel_id) ?? "unknown";
}

function get_topic_count(channel_id: number): number {
    return DB.channel_topic.get_id2_count(channel_id);
}

function channel_row_html(channel_id: number): string {
    const name = get_channel_name(channel_id);
    const topic_count = get_topic_count(channel_id);

    return `
<div class="channel_row">
    <div class="channel_name">${he.escape(name)}</div>
    <div>
        <a href="/topics/${channel_id}">topics</a>
    </div>
    <div class="channel_count">${topic_count} topics</div>
</div>
`;
}

export function html(): string {
    const channel_ids = DB.channel_name.id_array();

    alpha_sort(channel_ids, get_channel_name);

    let html = `<h4>${channel_ids.length} channels</h4>`;

    for (const channel_id of channel_ids) {
        html += channel_row_html(channel_id);
    }

    return html;
}
