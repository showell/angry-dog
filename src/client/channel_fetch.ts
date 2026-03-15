import type { Stream } from "../database/db_types";

import { DB } from "../database/database";
import * as zulip_client from "./zulip_client";

async function fetch_streams(): Promise<Stream[]> {
    const subscriptions = await zulip_client.get_subscriptions();

    const streams: Stream[] = subscriptions.map((subscription: any) => {
        return {
            stream_id: subscription.stream_id,
            name: subscription.name,
        };
    });

    return streams;
}

export async function fetch_channel_data(): Promise<void> {
    const streams = await fetch_streams();
    for (const stream of streams) {
        DB.channel_map.set(stream.stream_id, stream);
    }
}
