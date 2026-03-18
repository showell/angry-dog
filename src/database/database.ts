export let DB: Database;

import { IntInt } from "../util/int_int";
import { IntIntInt } from "../util/int_int_int";
import { IntString } from "../util/int_string";

export type Database = {
    channel_topic: IntIntInt;

    message_sender: IntInt;
    message_channel: IntInt;
    message_to_channel_topic: IntInt;
    message_content: IntInt;

    content_string: IntString;
    channel_name: IntString;
    user_full_name: IntString;
    topic_name: IntString;
};

export function initialize_DB(): void {
    DB = {
        channel_topic: new IntIntInt(),

        message_sender: new IntInt(),
        message_channel: new IntInt(),
        message_to_channel_topic: new IntInt(),
        message_content: new IntInt(),

        content_string: new IntString(),
        channel_name: new IntString(),
        user_full_name: new IntString(),
        topic_name: new IntString(),
    };
}
