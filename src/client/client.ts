import type { ZulipEvent } from "./event";

import * as database from "../database/database";

import { EventHandler } from "./event";
import * as channel_fetch from "./channel_fetch";
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

    database.initialize_DB();

    await channel_fetch.fetch_channel_data();
    await message_fetch.fetch_initial_messages();

    zulip_client.start_polling(event_manager);

    message_fetch.backfill();
}
