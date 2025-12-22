import createFetchClient from "openapi-fetch"
import createClient from "openapi-react-query"
import { CONFIG } from "../model/config"
import type { ApiPaths } from "./schema"

export const publicFetchClient = createFetchClient<ApiPaths>({
  baseUrl: CONFIG.API_BASE_URL,
})

export const publicRqClient = createClient(publicFetchClient)
