import type { Message } from "./db_types";
import type { Filter } from "./filter";
import type { ChannelRow, TopicRow } from "./row_types";

import { DB } from "./database";
import * as channel_row_query from "./channel_row_query";
import * as topic_row_query from "./topic_row_query";

export function get_channel_rows(): ChannelRow[] {
    return channel_row_query.get_rows(DB.channel_map, [
        ...DB.message_map.values(),
    ]);
}

export function channel_name_for(channel_id: number): string {
    return DB.channel_map.get(channel_id)!.name;
}

export function topic_name_for(topic_id: number): string {
    return DB.topic_map.get(topic_id)!.topic_name;
}

export function messages_for_topic(topic_id: number): Message[] {
    const messages = DB.message_map.values();
    const result = [];

    for (const message of messages) {
        if (message) {
            if (message.topic_id === topic_id) {
                result.push(message);
            }
        }
    }

    result.sort((m1, m2) => m1.id - m2.id);

    return result;
}

export function get_topic_rows(stream_id: number): TopicRow[] {
    function predicate(message: Message) {
        return message.stream_id === stream_id;
    }
    const messages = filtered_messages({ predicate });
    return topic_row_query.get_rows(DB.topic_map, messages);
}

// MESSAGES

export function filtered_messages(filter: Filter): Message[] {
    const result = [];
    for (const message of DB.message_map.values()) {
        if (filter.predicate(message)) {
            result.push(message);
        }
    }
    result.sort((m1, m2) => m1.id - m2.id);
    return result;
}
