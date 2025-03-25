export class Message {
    public readonly id!: string;
    public chatId!: string;
    public isRead!: boolean;
    public content!: string;
    public senderId!: string;
    public readAt!: Date | null;
    public sentAt!: Date;

    constructor(data: Partial<Message>) {
        Object.assign(this, data);
    }
}