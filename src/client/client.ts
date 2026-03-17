import * as database from "../database/database";

import * as channel_fetch from "./channel_fetch";
import * as message_fetch from "./message_fetch";

export async function start() {
    database.initialize_DB();
    await channel_fetch.fetch_channel_data();
    await message_fetch.fetch_initial_messages();
    message_fetch.backfill();
}
