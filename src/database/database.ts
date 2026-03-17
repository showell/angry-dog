import type { User, Channel, Message, Topic } from "./db_types";

export let DB: Database;

import { IntInt } from "../util/int_int";
import { IntIntInt } from "../util/int_int_int";
import { IntString } from "../util/int_string";

export type ChannelMap = Map<number, Channel>;
export type MessageMap = Map<number, Message>;
export type TopicMap = Map<number, Topic>;
export type UserMap = Map<number, User>;

export type Database = {
    user_map: UserMap;
    channel_map: ChannelMap;
    topic_map: TopicMap;
    message_map: MessageMap;

    // new stuff
    channel_topic: IntIntInt;

    message_sender: IntInt;
    message_channel: IntInt;
    message_to_channel_topic: IntInt;
    message_content: IntInt;

    content_string: IntString;
    channel_name: IntString;
    user_full_name: IntString;
    topic_name: IntString;
};

export function initialize_DB(): void {
    const user_map = new Map<number, User>();
    const channel_map = new Map<number, Channel>();
    const message_map = new Map<number, Message>();
    const topic_map = new Map<number, Topic>();

    const channel_name = new IntString();

    DB = {
        user_map,
        channel_map,
        topic_map,
        message_map,

        // new stuff
        channel_topic: new IntIntInt(),

        message_sender: new IntInt(),
        message_channel: new IntInt(),
        message_to_channel_topic: new IntInt(),
        message_content: new IntInt(),

        content_string: new IntString(),
        channel_name: new IntString(),
        user_full_name: new IntString(),
        topic_name: new IntString(),
    };
}

// HELPERS

export function insert_channel(channel: Channel): void {
    DB.channel_map.set(channel.channel_id, channel);

    //NEW
    DB.channel_name.set(channel.channel_id, channel.name);
}

export function set_topic(topic: Topic): void {
    DB.topic_map.set(topic.topic_id, topic);
}

export function insert_message(message: Message): void {
    DB.message_map.set(message.message_id, message);

    //NEW

    const subject = DB.topic_map.get(message.topic_id)!.topic_name;

    const angry_dog_topic_id = DB.topic_name.get_or_make(subject);
    const angry_dog_channel_topic_id = DB.channel_topic.get_or_make_id(message.channel_id, angry_dog_topic_id);
    const angry_dog_content_id = DB.content_string.get_or_make(message.content);

    DB.message_sender.set(message.message_id, message.sender_id);
    DB.message_channel.set(message.message_id, message.channel_id);
    DB.message_to_channel_topic.set(message.message_id, angry_dog_channel_topic_id);
    DB.message_content.set(message.message_id, angry_dog_content_id);
}

export function add_user_if_missing(user: User): void {
    const user_id = user.user_id;

    if (!DB.user_map.has(user_id)) {
        DB.user_map.set(user_id, user);
    }

    //NEW
    DB.user_full_name.set(user.user_id, user.full_name);
}
