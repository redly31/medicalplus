import { create } from "zustand"
import { jwtDecode } from "jwt-decode"
import { publicFetchClient } from "../api/instance"
import type { ApiSchemas } from "../api/schema"

type Session = {
  id: string
  name: string
  email: string
  role: ApiSchemas["UserRole"]
  exp: number
  iat: number
}

const TOKEN_KEY = "token"

let refreshPromise: Promise<string | null> | null = null

type SessionState = {
  token: string | null
  session: Session | null
  login: (newToken: string) => void
  logout: () => void
  refreshToken: () => Promise<string | null>
}

export const useSession = create<SessionState>((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  session: localStorage.getItem(TOKEN_KEY)
    ? jwtDecode<Session>(localStorage.getItem(TOKEN_KEY)!)
    : null,
  login: (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    set({ token: newToken, session: jwtDecode<Session>(newToken) })
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: null, session: null })
  },
  refreshToken: async (): Promise<string | null> => {
    const token = get().token
    if (!token) return null

    const decoded = jwtDecode<Session>(token)

    if (decoded.exp < Date.now() / 1000 + 30) {
      if (!refreshPromise) {
        refreshPromise = publicFetchClient
          .POST("/auth/refresh", {
            params: {
              cookie: { refreshToken: token },
            },
            credentials: "include",
          })
          .then(({ data, error }) => {
            if (error) {
              console.error("Refresh error:", error)
              return null
            }
            return data?.accessToken ?? null
          })
          .then((newToken) => {
            if (newToken) {
              get().login(newToken)
              return newToken
            }

            return null
          })
          .finally(() => {
            refreshPromise = null
          })
      }

      return await refreshPromise
    }

    return token
  },
}))
