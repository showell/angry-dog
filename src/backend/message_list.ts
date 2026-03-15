import type { Message } from "../database/db_types";

export type ListInfo = {
    count: number;
    num_topics: number;
};

export class MessageList {
    messages: Message[];

    constructor() {
        this.messages = [];
    }

    push(message: Message): void {
        this.messages.push(message);
    }

    list_info(): ListInfo {
        const messages = this.messages;

        if (messages.length === 0) {
            return {
                count: 0,
                num_topics: 0,
            };
        }

        const count = messages.length;
        const num_topics = this.num_topics();

        return { count, num_topics };
    }

    num_topics(): number {
        const messages = this.messages;
        const set = new Set<number>();

        for (const message of messages) {
            set.add(message.topic_id);
        }

        return set.size;
    }
}
