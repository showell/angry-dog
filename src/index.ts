import { serve } from "@hono/node-server";
import { Hono } from "hono";

import type { ZulipEvent } from "./server/event";

import * as database from "./database/database";

import { EventHandler } from "./server/event";
import * as message_fetch from "./server/message_fetch";
import * as zulip_client from "./server/zulip_client";

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

async function start_model_code() {
    function handle_zulip_event(event: ZulipEvent) {
        database.handle_event(event);
    }

    const event_manager = new EventHandler(handle_zulip_event);

    // we wait for register to finish, but then polling goes
    // on "forever" asynchronously
    await zulip_client.register_queue();

    await database.fetch_original_data();

    zulip_client.start_polling(event_manager);

    message_fetch.backfill(database.DB);
}

async function run() {
    await start_model_code();

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

    app.get("/topic_messages/:topic_id", (c) => {
        const topic_id = c.req.param("topic_id");
        let html = boilerplate();
        html += messages.by_topic_html(parseInt(topic_id));
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
