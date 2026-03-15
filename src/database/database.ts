import type { User, Channel, Message } from "./db_types";
import type { ZulipEvent } from "../client/event";

import { EventFlavor } from "../client/event";

import { TopicMap } from "./topic_map";

export let DB: Database;

export type ChannelMap = Map<number, Channel>;
export type MessageMap = Map<number, Message>;
export type UserMap = Map<number, User>;

export type Database = {
    user_map: UserMap;
    channel_map: ChannelMap;
    topic_map: TopicMap;
    message_map: MessageMap;
};

export function initialize_DB(): void {
    const user_map = new Map<number, User>();
    const channel_map = new Map<number, Channel>();
    const message_map = new Map<number, Message>();

    const topic_map = new TopicMap();

    DB = {
        user_map,
        channel_map,
        topic_map,
        message_map,
    };
}

// HELPERS

export function topic_id_for(channel_id: number, topic_name: string): number {
    const topic = DB.topic_map.get_or_make_topic_for(channel_id, topic_name);
    return topic.topic_id;
}

export function insert_channel(channel: Channel): void {
    DB.channel_map.set(channel.channel_id, channel);
}

export function insert_message(message: Message): void {
    DB.message_map.set(message.message_id, message);
}

export function add_user_if_missing(user: User): void {
    const user_id = user.user_id;

    if (!DB.user_map.has(user_id)) {
        DB.user_map.set(user_id, user);
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
