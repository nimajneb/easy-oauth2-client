import { TokenRequest } from "../util/token-request"
import { AccessToken } from "../token/access-token"
import { ClientOptions } from ".."

export class ClientCredentials {
    protected token: AccessToken | undefined

    constructor(private options: ClientOptions) {}

    async getToken(): Promise<AccessToken | null> {
        if (this.token && !this.token.expired) return this.token

        try {
            const res = await TokenRequest.post(
                `${this.options.authHost}/oauth/token`,
                {
                    auth: {
                        username: this.options.clientId,
                        password: this.options.clientSecret,
                    },
                    body: {
                        grant_type: "client_credentials",
                    },
                },
            )

            this.token = new AccessToken(res)

            return this.token
        } catch (e) {
            return null
        }
    }
}
