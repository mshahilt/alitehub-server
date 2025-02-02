
export class Otp {
    private _code: string;
    private _email: string;
    private _createdAt: Date;
    private _expiresAt: Date;

    constructor(code: string, email: string, createdAt: Date, expiresAt: Date) {
        this._code = code;
        this._email = email;
        this._createdAt = createdAt;
        this._expiresAt = expiresAt;
    }

    get code() {
        return this._code;
    }

    get email() {
        return this._email;
    }

    get expiresAt() {
        return this._expiresAt;
    }

    isExpired(): boolean {
        return new Date() > this._expiresAt;
    }

    static generate(email: string): Otp {
        const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit OTP
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000); // 5 minutes expiration
        return new Otp(code, email, createdAt, expiresAt);
    }
}
