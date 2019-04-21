export interface AccessTokenResponse {
    access_token: string
    token_type: string
    expires_in?: number
    refresh_token?: string
    scope?: string
}

export class OAuthToken {
    protected expiresAt: Date | undefined

    constructor(private data: AccessTokenResponse) {
        if (this.data.expires_in !== undefined)
            this.expiresAt = this.getExpiryDate(this.data.expires_in)
    }

    public get expired(): boolean {
        if (this.expiresAt === undefined) return true

        const now = new Date().getSeconds() + 3600

        return now >= this.expiresAt.getSeconds()
    }

    public get accessToken(): string {
        return this.data.access_token
    }

    protected getExpiryDate(expiresIn: number): Date {
        const now = new Date().getSeconds()

        return new Date(now + expiresIn)
    }
}
