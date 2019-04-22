import { RequestOptions, IncomingMessage, ClientRequest } from "http"
import { request } from "https"
import { URL } from "url"
import { stringify } from "querystring"

export interface TokenRequestOptions {
    auth: {
        username: string
        password: string
    }
    body?: object
}

export interface TokenResponse {
    access_token: string
    token_type: string
    expires_in?: number
    refresh_token?: string
    scope?: string
}

export class TokenRequest {
    static post(
        url: string,
        opts: TokenRequestOptions,
    ): Promise<TokenResponse> {
        const u: URL = new URL(url)

        if (u.protocol !== "https:")
            throw new Error("Requests to the token endpoint must use TLS")

        let requestBody: string
        if (opts.body) requestBody = stringify(opts.body)

        return new Promise<TokenResponse>((resolve, reject) => {
            const auth = Buffer.from(
                `${opts.auth.username}:${opts.auth.password}`,
            ).toString("base64")

            const requestOpts: RequestOptions = {
                hostname: u.hostname,
                port: u.port,
                path: u.pathname,
                method: "POST",
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }

            const responseFn = (res: IncomingMessage): void => {
                let data = ""
                res.on("data", chunk => (data += chunk))
                res.on("end", () => resolve(JSON.parse(data)))
                res.on("error", err => reject(err.message))
            }

            let req: ClientRequest | undefined

            req = request(requestOpts, responseFn)
            if (req === undefined) {
                reject()
                return
            }

            req.write(requestBody)
            req.end()
        })
    }
}
