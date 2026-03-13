import { serve } from "@hono/node-server";
import { Hono } from "hono";

import * as database from "./backend/database";
import * as config from "./config";
import { TEST_CONFIG } from "./test_config";
import { DB } from "./backend/database";

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
    await database.fetch_original_data();

    const app = new Hono();

    app.get("/", (c) => {
        const html = links();
        return c.html(html);
    });

    app.get("/channels", (c) => {
        let html = links();
        const channels = [...DB.channel_map.values()];

        channels.sort((u1, u2) => u1.name.localeCompare(u2.name));

        html += `<h4>${channels.length} channels</h4>`;

        for (const channel of channels) {
            html += `<div>${channel.name}</div>`;
        }

        return c.html(html);
    });

    app.get("/messages", (c) => {
        let html = links();
        const messages = [...DB.message_map.values()];

        messages.sort((m1, m2) => m2.id - m1.id);

        for (const message of messages) {
            html += `<div>${message.content}</div>`;
        }

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
}

run();
