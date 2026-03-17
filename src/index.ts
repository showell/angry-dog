import { serve } from "@hono/node-server";
import { Hono } from "hono";

import * as client from "./client/client";

import * as css from "./css";

import * as channels from "./html/channels";
import * as messages from "./html/messages";
import * as topics from "./html/topics";

function boilerplate(): string {
    return (
        css.STYLE +
        `
        <div>
            <a href="/channels">Channels</a>
        </div>
    `
    );
}

async function run() {
    await client.start();

    const app = new Hono();

    app.get("/", (c) => {
        const html = boilerplate();
        return c.html(html);
    });

    app.get("/channels", (c) => {
        let html = boilerplate();
        html += channels.html();
        return c.html(html);
    });

    app.get("/topic_messages/:channel_topic_id", (c) => {
        const channel_topic_id = c.req.param("channel_topic_id");
        let html = boilerplate();
        html += messages.by_topic_html(parseInt(channel_topic_id));
        return c.html(html);
    });

    app.get("/topics/:channel_id", (c) => {
        const channel_id = c.req.param("channel_id");
        let html = boilerplate();
        html += topics.html(parseInt(channel_id));
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
