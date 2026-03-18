import { TEST_CONFIG } from "../test_config";

function get_headers() {
    const auth = btoa(`${TEST_CONFIG.email}:${TEST_CONFIG.api_key}`);
    const auth_header = `Basic ${auth}`;
    return { Authorization: auth_header };
}

export async function get_messages(anchor: string, num_before: number) {
    const url = new URL(`/api/v1/messages`, TEST_CONFIG.url);
    url.searchParams.set("narrow", `[]`);
    url.searchParams.set("num_before", JSON.stringify(num_before));
    url.searchParams.set("anchor", anchor);
    const response = await fetch(url, { headers: get_headers() });
    const data = await response.json();
    return data;
}

export async function get_subscriptions() {
    const url = new URL(`/api/v1/users/me/subscriptions`, TEST_CONFIG.url);
    const response = await fetch(url, { headers: get_headers() });
    const data = await response.json();
    return data.subscriptions;
}
