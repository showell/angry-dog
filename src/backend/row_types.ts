import type { Message, Stream, Topic } from "./db_types.ts";
import type { ListInfo } from "./message_list.ts";

import { DB } from "./database";

export class ChannelRow {
    _channel: Stream;
    _list_info: ListInfo;

    constructor(channel: Stream, list_info: ListInfo) {
        this._channel = channel;
        this._list_info = list_info;
    }

    id(): number {
        return this._channel.stream_id;
    }

    name(): string {
        return this._channel.name;
    }

    num_topics(): number {
        return this._list_info.num_topics;
    }
}

export class TopicRow {
    _topic: Topic;
    _list_info: ListInfo;

    constructor(topic: Topic, list_info: ListInfo) {
        this._topic = topic;
        this._list_info = list_info;
    }

    topic_id(): number {
        return this._topic.topic_id;
    }

    name(): string {
        return this._topic.topic_name;
    }

    num_messages(): number {
        return this._list_info.count;
    }
}

export class MessageRow {
    _message: Message;

    constructor(message: Message) {
        this._message = message;
    }

    sender_name(): string {
        const message = this._message;

        const user = DB.user_map.get(message.sender_id);
        if (user) {
            return user.full_name;
        } else {
            // TODO: system bots
            return "unknown";
        }
    }

    content(): string {
        return this._message.content;
    }
}
