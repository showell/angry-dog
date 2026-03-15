export type ServerMessage = {
    content: string;
    id: number;
    sender_full_name: string;
    sender_id: number;
    subject: string;
    stream_id: number;
    type: "stream";
};
