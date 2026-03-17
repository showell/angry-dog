import type { ServerMessage, ServerSubscription } from "../client/server_types";

import { fix_content } from "./content";
import { DB } from "./database";

export function process_server_subscription(
    subscription: ServerSubscription,
): void {
    DB.channel_name.set(subscription.stream_id, subscription.name);
}

export function process_server_message(server_message: ServerMessage) {
    const message_id = server_message.id;
    const channel_id = server_message.stream_id;
    const topic_name = server_message.subject;
    const content = fix_content(server_message.content);

    const sender_id = server_message.sender_id;
    const user_id = sender_id;
    const full_name = server_message.sender_full_name;

    const angry_dog_topic_id = DB.topic_name.get_or_make(topic_name);
    const angry_dog_channel_topic_id = DB.channel_topic.get_or_make_id(
        channel_id,
        angry_dog_topic_id,
    );
    const angry_dog_content_id = DB.content_string.get_or_make(content);

    DB.message_sender.set(message_id, sender_id);
    DB.message_channel.set(message_id, channel_id);
    DB.message_to_channel_topic.set(message_id, angry_dog_channel_topic_id);
    DB.message_content.set(message_id, angry_dog_content_id);

    DB.user_full_name.set(user_id, full_name);
}
