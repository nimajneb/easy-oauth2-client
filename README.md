# easy-oauth2-client

Zero-dependency nodejs OAuth2 client written in TypeScript. Currently work in progress, not recommended for production use.

## Installation
```
npm i easy-oauth2-client
```

## Usage

### Initializing the client
```ts
import { ClientCredentials } from 'easy-oauth2-client'

const oauthClient = new ClientCredentials({
    authHost: "https://auth.example.org",
    clientId: "my-client-id",
    clientSecret: "my-client-secret",
})
```

### Obtaining and using the access token

The access token can be obtained using the `getToken` method and then used in further requests, e.g. when using the [request library](https://github.com/request/request):

```ts
import request from "request"

const token = await oauthClient.getToken()

if (token)
    const resource = await request.get("https://api.example.org/protected-resource/", {
        auth: {
            bearer: token.accessToken,
        },
    })
```

## Supported OAuth2 flows

- [ ] Authorization Code
- [ ] Implicit
- [ ] Resource Owner Password Credentials
- [x] Client Credentials
