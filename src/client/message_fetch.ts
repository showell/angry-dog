import type { Message } from "../database/db_types";
import type { ServerMessage } from "./zulip_client";

import * as database from "../database/database";
import * as zulip_client from "./zulip_client";

const INITIAL_BATCH_SIZE = 1000;
const BACKFILL_BATCH_SIZE = 5000;
const MAX_SIZE = 50_000; // not exact always

type State = {
    found_oldest: boolean;
    oldest_id: number;
};

let STATE: State;

export async function fetch_initial_messages(): Promise<void> {
    const data = await zulip_client.get_messages("newest", INITIAL_BATCH_SIZE);

    STATE = {
        found_oldest: data.found_oldest,
        oldest_id: data.messages[0].id,
    };

    process_message_rows_from_server(data.messages);

    console.log(`${database.DB.message_map.size} messages fetched!`);
    console.log(STATE);
}

export async function backfill(): Promise<void> {
    while (!STATE.found_oldest) {
        const num_before = Math.min(
            MAX_SIZE - database.DB.message_map.size,
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

        process_message_rows_from_server(data.messages);

        console.log(`${database.DB.message_map.size} messages in cache! (backfill)`);
        console.log(STATE);

        await new Promise((resolve) => setTimeout(resolve, 500));
    }
}

function process_message_rows_from_server(
    server_messages: ServerMessage[],
): void {
    const stream_messages: ServerMessage[] = server_messages.filter(
        (row) => row.type === "stream",
    );

    for (const server_message of stream_messages) {
        database.process_server_message(server_message);
    }
}
