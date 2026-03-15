import type { ServerMessage, ServerSubscription } from "../client/server_types";

import type { Message } from "./db_types";

import { fix_content } from "./content";
import * as database from "./database";

export function process_server_subscription(
    subscription: ServerSubscription,
): void {
    const channel = {
        channel_id: subscription.stream_id,
        name: subscription.name,
    };
    database.insert_channel(channel);
}

export function process_server_message(server_message: ServerMessage) {
    const message_id = server_message.id;
    const channel_id = server_message.stream_id;
    const topic_name = server_message.subject;
    const content = fix_content(server_message.content);

    const sender_id = server_message.sender_id;

    const topic_id = database.topic_id_for(channel_id, topic_name);

    const message: Message = {
        content,
        message_id,
        sender_id,
        channel_id,
        topic_id,
    };

    database.insert_message(message);

    const user_id = sender_id;
    const full_name = server_message.sender_full_name;
    const user = { user_id, full_name };

    database.add_user_if_missing(user);
}
