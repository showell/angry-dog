export type Message = {
    content: string;
    id: number;
    sender_id: number;
    stream_id: number;
    topic_id: number;
};

export type Stream = {
    stream_id: number;
    name: string;
};

export type User = {
    id: number;
    full_name: string;
};

export type Topic = {
    topic_id: number;
    channel_id: number;
    topic_name: string;
};
