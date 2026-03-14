import type { EventHandler } from "./event";

import * as config from "../config";

let queue_id: string | undefined;
let last_event_id: string | undefined;

function get_headers() {
    const auth = btoa(
        `${config.get_email_for_current_realm()}:${config.get_api_key_for_current_realm()}`,
    );
    const auth_header = `Basic ${auth}`;
    return { Authorization: auth_header };
}

export async function register_queue() {
    const url = new URL("/api/v1/register", config.get_current_realm_url());
    url.searchParams.set("apply_markdown", "true");
    url.searchParams.set("include_subscribers", "false");
    url.searchParams.set("slim_presence", "true");
    url.searchParams.set("all_public_streams", "false");
    url.searchParams.set("client", "Angry Cat (showell)");

    const response = await fetch(url, {
        method: "POST",
        headers: get_headers(),
    });
    const data = await response.json();
    queue_id = data.queue_id;
    last_event_id = data.last_event_id;
}

export async function start_polling(event_handler: EventHandler) {
    if (queue_id === undefined || last_event_id === undefined) {
        return;
    }

    const url = new URL("/api/v1/events", config.get_current_realm_url());

    while (queue_id !== undefined && last_event_id !== undefined) {
        url.searchParams.set("queue_id", queue_id);
        url.searchParams.set("last_event_id", last_event_id);

        const response = await fetch(url, { headers: get_headers() });
        const data = await response.json();

        if (data.result !== "success") {
            window.location.reload();
        }
        if (data.events?.length) {
            last_event_id = data.events[data.events.length - 1].id;
            event_handler.process_events(data.events);
        }
    }
}

export type ServerMessage = {
    content: string;
    id: number;
    sender_full_name: string;
    sender_id: number;
    subject: string;
    stream_id: number;
    type: "stream";
};

export async function get_messages(anchor: string, num_before: number) {
    const url = new URL(`/api/v1/messages`, config.get_current_realm_url());
    url.searchParams.set("narrow", `[]`);
    url.searchParams.set("num_before", JSON.stringify(num_before));
    url.searchParams.set("anchor", anchor);
    const response = await fetch(url, { headers: get_headers() });
    const data = await response.json();
    return data;
}

export async function get_users() {
    const url = new URL(`/api/v1/users`, config.get_current_realm_url());
    const response = await fetch(url, { headers: get_headers() });
    const data = await response.json();
    return data.members;
}

export async function get_subscriptions() {
    const url = new URL(
        `/api/v1/users/me/subscriptions`,
        config.get_current_realm_url(),
    );
    const response = await fetch(url, { headers: get_headers() });
    const data = await response.json();
    return data.subscriptions;
}
