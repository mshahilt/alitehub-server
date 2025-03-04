export class Connection {
    public readonly id!: string;
    public userId1!: string;
    public userId2!: string;
    public status!: 'pending' | 'accepted' | 'declined';
    public requestedAt!: Date;
    public respondedAt?: Date;
    public isMutual!: boolean;

    constructor(data: Partial<Connection>) {
        Object.assign(this, data);
    }
}
