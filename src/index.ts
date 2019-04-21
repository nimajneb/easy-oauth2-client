import request from "request-promise-native"
import { OAuthToken, AccessTokenResponse } from './oauth-token'

export interface OAuthClientOptions {
    authHost: string
    clientId?: string
    clientSecret?: string
}

export class OAuthClient {
    protected token: OAuthToken | undefined

    constructor(private options: OAuthClientOptions) {}

    async getToken(): Promise<OAuthToken | null> {
        if (this.token && !this.token.expired) return this.token

        try {
            const res = await request.post(
                `${
                    this.options.authHost
                }/oauth/token?grant_type=client_credentials`,
                {
                    auth: {
                        username: this.options.clientId,
                        password: this.options.clientSecret,
                    },
                },
            )

            const response: AccessTokenResponse = JSON.parse(res)
            this.token = new OAuthToken(response)

            return this.token
        } catch (e) {
            console.error('Could not retrieve token')
            console.error(e)

            return null
        }
    }
}
