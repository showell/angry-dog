import type { User, Channel, Message } from "./db_types";
import type { ZulipEvent } from "../client/event";
import type { ServerMessage } from "../client/zulip_client";

import { EventFlavor } from "../client/event";
import { fix_content } from "./content";

import { TopicMap } from "./topic_map";

export let DB: Database;

export type MessageMap = Map<number, Message>;
export type UserMap = Map<number, User>;

export type Database = {
    user_map: Map<number, User>;
    channel_map: Map<number, Channel>;
    topic_map: TopicMap;
    message_map: MessageMap;
};

export function initialize_DB(): void {
    const user_map = new Map<number, User>();
    const channel_map = new Map<number, Channel>();
    const topic_map = new TopicMap();
    const message_map = new Map<number, Message>();

    DB = {
        user_map,
        channel_map,
        topic_map,
        message_map,
    };
}

export function process_server_message(server_message: ServerMessage) {
    const message_id = server_message.id;
    const channel_id = server_message.stream_id;
    const topic_name = server_message.subject;
    const content = fix_content(server_message.content);

    const sender_id = server_message.sender_id;

    const topic = DB.topic_map.get_or_make_topic_for(channel_id, topic_name);
    const topic_id = topic.topic_id;

    const message: Message = {
        content,
        message_id,
        sender_id,
        channel_id,
        topic_id,
    };

    DB.message_map.set(message_id, message);

    if (!DB.user_map.has(sender_id)) {
        const id = sender_id;
        const full_name = server_message.sender_full_name;
        const user = { id, full_name };
        DB.user_map.set(id, user);
    }
}

// EVENTS

export function handle_event(event: ZulipEvent): void {
    if (event.flavor === EventFlavor.MESSAGE) {
        add_message_to_cache(event.message);
    }

    if (event.flavor === EventFlavor.MUTATE_MESSAGE_ADDRESS) {
        mutate_messages(event.message_ids, (message) => {
            message.channel_id = event.new_channel_id;
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
    DB.message_map.set(message.message_id, message);
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
