import type { Topic } from "./db_types";

class TopicHelper {
    key_map: Map<string, Topic>; // key -> topic
    seq: number;

    constructor() {
        this.seq = 0;
        this.key_map = new Map<string, Topic>();
    }

    get_or_make_topic_for(channel_id: number, topic_name: string): Topic {
        const key_map = this.key_map;

        const key = `${channel_id},${topic_name}`;
        const existing_topic = key_map.get(key);

        if (existing_topic) {
            return existing_topic;
        }

        this.seq += 1;
        const topic = { topic_id: this.seq, channel_id, topic_name };
        this.key_map.set(key, topic);

        return topic;
    }
}

// For convenience, we just make this completely global.
export const TOPIC_HELPER = new TopicHelper();
