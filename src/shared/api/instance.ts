import createFetchClient from "openapi-fetch"
import createClient from "openapi-react-query"
import type { ApiPaths, ApiSchemas } from "./schema"
import { CONFIG } from "../model/config"
import { useSession } from "../model/session"

export const fetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_BASE_URL,
})

fetchClient.use({
  async onRequest({ request }) {
    const token = await useSession.getState().refreshToken()

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`)
    } else {
      return new Response(
        JSON.stringify({
          code: "401",
          message: "You are not authorized to access this resource",
        } as ApiSchemas["ErrorResponse"]),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    }
  },
})

export const privateRqClient = createClient(fetchClient)

export const publicFetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_BASE_URL,
})

export const publicRqClient = createClient(publicFetchClient)
