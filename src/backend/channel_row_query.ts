import type { Message, Stream } from "../database/db_types";

import { MessageList } from "./message_list";
import { ChannelRow } from "./row_types";

export function get_rows(
    channel_map: Map<number, Stream>,
    messages: Message[],
): ChannelRow[] {
    const channel_ids = [...channel_map.keys()];
    const message_list_map = new Map<number, MessageList>();

    for (const message of messages) {
        const channel_id = message.channel_id;

        const message_list =
            message_list_map.get(channel_id) ?? new MessageList();

        message_list.push(message);
        message_list_map.set(channel_id, message_list);
    }

    const rows: ChannelRow[] = [];

    for (const channel_id of channel_ids) {
        const message_list =
            message_list_map.get(channel_id) ?? new MessageList();
        const list_info = message_list.list_info();
        const stream = channel_map.get(channel_id)!;
        const channel_row = new ChannelRow(stream, list_info);

        rows.push(channel_row);
    }

    return rows;
}
