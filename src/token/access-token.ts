import { TokenResponse } from "../util/token-request"

export class AccessToken {
    protected expiresAt: Date | undefined

    constructor(private data: TokenResponse) {
        if (this.data.expires_in !== undefined)
            this.expiresAt = this.getExpiryDate(this.data.expires_in * 1000)
    }

    public get expired(): boolean {
        if (this.expiresAt === undefined) return true

        const now = new Date().getTime() + 3600000

        return now >= this.expiresAt.getTime()
    }

    public get accessToken(): string {
        return this.data.access_token
    }

    protected getExpiryDate(expiresIn: number): Date {
        const now = new Date().getTime()

        return new Date(now + expiresIn)
    }
}
