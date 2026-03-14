import type { ZulipEvent } from "./event";

import * as database from "../database/database";

import { EventHandler } from "./event";
import * as message_fetch from "./message_fetch";
import * as zulip_client from "./zulip_client";

export async function start() {
    function handle_zulip_event(event: ZulipEvent) {
        database.handle_event(event);
    }

    const event_manager = new EventHandler(handle_zulip_event);

    // we wait for register to finish, but then polling goes
    // on "forever" asynchronously
    await zulip_client.register_queue();

    await database.fetch_original_data();

    zulip_client.start_polling(event_manager);

    message_fetch.backfill(database.DB);
}
