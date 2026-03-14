import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { DB, fetch_original_data } from "./backend/database";
import * as message_fetch from "./backend/message_fetch";

import * as config from "./config";
import { TEST_CONFIG } from "./test_config";

import * as channels from "./pages/channels";
import * as messages from "./pages/messages";
import * as topics from "./pages/topics";

function links(): string {
    return `
        <div>
            <a href="/channels">Channels</a>
            <a href="/messages">Messages</a>
            <a href="/users">Users</a>
        </div>
    `;
}

async function run() {
    config.set_current_realm_config(TEST_CONFIG);
    await fetch_original_data();

    const app = new Hono();

    app.get("/", (c) => {
        const html = links();
        return c.html(html);
    });

    app.get("/channels", (c) => {
        let html = links();
        html += channels.html();
        return c.html(html);
    });

    app.get("/messages", (c) => {
        const t = performance.now();
        let html = links();
        html += messages.html();
        const elapsed = performance.now() - t;
        console.log("messages: elapsed", elapsed.toFixed(3));
        return c.html(html);
    });

    app.get("/topic_messages/:topic_id", (c) => {
        const topic_id = c.req.param("topic_id");
        let html = links();
        html += messages.by_topic_html(parseInt(topic_id));
        return c.html(html);
    });

    app.get("/topics/:channel_id", (c) => {
        const channel_id = c.req.param("channel_id");
        let html = links();
        html += topics.html(parseInt(channel_id));
        return c.html(html);
    });

    app.get("/users", (c) => {
        let html = links();
        const users = [...DB.user_map.values()];

        users.sort((u1, u2) => u1.full_name.localeCompare(u2.full_name));

        html += `<h4>${users.length} users</h4>`;

        for (const user of users) {
            html += `<div>${user.full_name}</div>`;
        }

        return c.html(html);
    });

    const server = serve(
        {
            fetch: app.fetch,
            port: 3000,
        },
        (info) => {
            console.log(`Server is running on http://localhost:${info.port}`);
        },
    );

    // Add this to your main app file (e.g., app.ts)
    if (import.meta.hot) {
        import.meta.hot.on("vite:beforeFullReload", () => {
            // Replace 'server' with your HTTP server instance
            server.close();
        });
    }

    message_fetch.backfill(DB);
}

run();
