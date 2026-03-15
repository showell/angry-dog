export type Message = {
    message_id: number;
    sender_id: number;
    channel_id: number;
    topic_id: number;
    content: string;
};

export type Channel = {
    channel_id: number;
    name: string;
};

export type User = {
    user_id: number;
    full_name: string;
};

export type Topic = {
    topic_id: number;
    channel_id: number;
    topic_name: string;
};
