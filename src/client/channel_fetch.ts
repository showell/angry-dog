import * as zulip_glue from "../database/zulip_glue";
import * as zulip_client from "./zulip_client";

export async function fetch_channel_data(): Promise<void> {
    const subscriptions = await zulip_client.get_subscriptions();

    for (const subscription of subscriptions) {
        zulip_glue.process_server_subscription(subscription);
    }
}
