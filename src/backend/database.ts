import type { User, Stream, Message } from "./db_types";
import type { ZulipEvent } from "./event";

import { EventFlavor } from "./event";
import * as fetch from "./fetch";
import { TopicMap } from "./topic_map";

export let DB: Database;

export type MessageMap = Map<number, Message>;
export type UserMap = Map<number, User>;

export type Database = {
    user_map: Map<number, User>;
    channel_map: Map<number, Stream>;
    topic_map: TopicMap;
    message_map: MessageMap;
};

export async function fetch_original_data(): Promise<void> {
    DB = await fetch.fetch_model_data();
}

// EVENTS

export function handle_event(event: ZulipEvent): void {
    if (event.flavor === EventFlavor.MESSAGE) {
        add_message_to_cache(event.message);
    }

    if (event.flavor === EventFlavor.MUTATE_MESSAGE_ADDRESS) {
        mutate_messages(event.message_ids, (message) => {
            message.stream_id = event.new_channel_id;
            message.topic_id = event.new_topic_id;
        });
    }

    if (event.flavor === EventFlavor.MUTATE_MESSAGE_CONTENT) {
        mutate_message(event.message_id, (message) => {
            message.content = event.content;
        });
    }
}

function add_message_to_cache(message: Message) {
    DB.message_map.set(message.id, message);
}

function mutate_message(
    message_id: number,
    mutate: (message: Message) => void,
): void {
    const message = DB.message_map.get(message_id);
    if (message) {
        mutate(message);
    } else {
        console.log("UNKNOWN message id!", message_id);
    }
}

function mutate_messages(
    message_ids: number[],
    mutate: (message: Message) => void,
): void {
    for (const message_id of message_ids) {
        mutate_message(message_id, mutate);
    }
}
