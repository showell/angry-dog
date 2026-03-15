import type { Database } from "../database/database";
import type { Message } from "../database/db_types";
import type { ServerMessage } from "./zulip_client";

import { fix_content } from "./content";
import * as zulip_client from "./zulip_client";

const INITIAL_BATCH_SIZE = 1000;
const BACKFILL_BATCH_SIZE = 5000;
const MAX_SIZE = 50_000; // not exact always

type State = {
    found_oldest: boolean;
    oldest_id: number;
};

let STATE: State;

export async function fetch_initial_messages(db: Database): Promise<void> {
    const data = await zulip_client.get_messages("newest", INITIAL_BATCH_SIZE);

    STATE = {
        found_oldest: data.found_oldest,
        oldest_id: data.messages[0].id,
    };

    process_message_rows_from_server(db, data.messages);

    console.log(`${db.message_map.size} messages fetched!`);
    console.log(STATE);
}

export async function backfill(db: Database): Promise<void> {
    while (!STATE.found_oldest) {
        const num_before = Math.min(
            MAX_SIZE - db.message_map.size,
            BACKFILL_BATCH_SIZE,
        );

        if (num_before <= 0) {
            break;
        }

        console.log("attempt to fetch", num_before);

        const data = await zulip_client.get_messages(
            STATE.oldest_id.toString(),
            num_before,
        );

        STATE = {
            found_oldest: data.found_oldest,
            oldest_id: data.messages[0].id,
        };

        process_message_rows_from_server(db, data.messages);

        console.log(`${db.message_map.size} messages in cache! (backfill)`);
        console.log(STATE);

        await new Promise((resolve) => setTimeout(resolve, 500));
    }
}

function process_message_rows_from_server(
    db: Database,
    server_messages: ServerMessage[],
): void {
    const stream_messages: ServerMessage[] = server_messages.filter(
        (row) => row.type === "stream",
    );

    for (const server_message of stream_messages) {
        const message_id = server_message.id;
        const channel_id = server_message.stream_id;
        const topic_name = server_message.subject;
        const content = fix_content(server_message.content);

        const sender_id = server_message.sender_id;

        const topic = db.topic_map.get_or_make_topic_for(
            channel_id,
            topic_name,
        );
        const topic_id = topic.topic_id;

        const message: Message = {
            content,
            message_id,
            sender_id,
            channel_id,
            topic_id,
        };

        db.message_map.set(message_id, message);

        if (!db.user_map.has(sender_id)) {
            const id = sender_id;
            const full_name = server_message.sender_full_name;
            const user = { id, full_name };
            db.user_map.set(id, user);
        }
    }
}
