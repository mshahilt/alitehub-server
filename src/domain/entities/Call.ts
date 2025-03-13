export class Call {
    public readonly id!: string;
    public callType!: "interview" | "normal";
    public caller!: string;
    public callerType!: "User" | "Company";
    public receiver!: string;
    public receiverType!: "User" | "Company";
    public roomId!: string;
    public status!: "scheduled" | "ongoing" | "ended";
    public scheduledTime?: Date;
    public endedAt?: Date;

    constructor(data: Partial<Call>) {
        Object.assign(this, data);
    }
}
