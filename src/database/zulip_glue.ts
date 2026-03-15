import type { ServerMessage, ServerSubscription } from "../client/server_types";

import type { Message } from "./db_types";

import { fix_content } from "./content";
import { DB } from "./database";

export function process_server_subscription(
    subscription: ServerSubscription,
): void {
    const channel = {
        channel_id: subscription.stream_id,
        name: subscription.name,
    };
    DB.channel_map.set(channel.channel_id, channel);
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
