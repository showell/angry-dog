import type { User, Channel, Message, Topic } from "./db_types";

export let DB: Database;

export type ChannelMap = Map<number, Channel>;
export type MessageMap = Map<number, Message>;
export type TopicMap = Map<number, Topic>;
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
    const topic_map = new Map<number, Topic>();

    DB = {
        user_map,
        channel_map,
        topic_map,
        message_map,
    };
}

// HELPERS

export function insert_channel(channel: Channel): void {
    DB.channel_map.set(channel.channel_id, channel);
}

export function set_topic(topic: Topic): void {
    DB.topic_map.set(topic.topic_id, topic);
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
