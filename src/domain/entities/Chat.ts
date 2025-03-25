export class Chat {
    public readonly id?: string;
    public lastMessage!: {
        sentAt: Date;
        text: string
    };
    public participants!: (string)[];
    constructor(data: Partial<Chat>) {
        Object.assign(this, data);
    }
}