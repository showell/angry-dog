import type { Database } from "../database/database";
import type { Message, Stream, User } from "../database/db_types";

import { TopicMap } from "../database/topic_map";

import * as message_fetch from "./message_fetch";
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

export async function fetch_model_data(): Promise<Database> {
    console.log("start fetch");

    const user_map = new Map<number, User>();

    const streams = await fetch_streams();

    const channel_map = new Map<number, Stream>();

    for (const stream of streams) {
        channel_map.set(stream.stream_id, stream);
    }

    const topic_map = new TopicMap();
    const message_map = new Map<number, Message>();

    const db = {
        user_map,
        channel_map,
        topic_map,
        message_map,
    };

    await message_fetch.fetch_initial_messages(db);

    return db;
}
