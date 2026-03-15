import * as database from "../database/database";
import * as zulip_client from "./zulip_client";

export async function fetch_channel_data(): Promise<void> {
    const subscriptions = await zulip_client.get_subscriptions();

    for (const subscription of subscriptions) {
        database.process_server_subscription(subscription);
    }
}
