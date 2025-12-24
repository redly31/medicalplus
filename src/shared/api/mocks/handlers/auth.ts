import { HttpResponse } from "msw"
import type { ApiSchemas } from "../../schema"
import { http } from "../http"
import {
  createRefreshTokenCookie,
  generateTokens,
  verifyToken,
} from "../session"

export const mockUsers: Omit<ApiSchemas["User"], "password">[] = [
  {
    id: "1",
    email: "admin@gmail.com",
    name: "Jane Doe",
    role: "admin",
  },
  {
    id: "2",
    email: "john@gmail.com",
    name: "Dr. John Smith",
    role: "patient",
  },
  {
    id: "3",
    email: "jane@gmail.com",
    name: "Jane Doe",
    role: "doctor",
  },
]

const userPasswords = new Map<string, string>()
userPasswords.set("admin@gmail.com", "123")
userPasswords.set("john@gmail.com", "123")
userPasswords.set("jane@gmail.com", "123")

export const authHandlers = [
  http.post("/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      email: string
      password: string
    }

    const user = mockUsers.find((u) => u.email === body.email)
    const storedPassword = userPasswords.get(body.email)

    if (!user || !storedPassword || storedPassword !== body.password) {
      return HttpResponse.json(
        {
          message: "Неверный email или пароль",
          code: "401",
        },
        { status: 401 }
      )
    }

    const { accessToken, refreshToken } = await generateTokens({
      id: user.id!,
      email: user.email!,
      role: user.role!,
    })

    const response: ApiSchemas["AuthResponse"] = {
      accessToken,
      user: user,
    }

    return HttpResponse.json(response, {
      status: 200,
      headers: {
        "Set-Cookie": createRefreshTokenCookie(refreshToken),
      },
    })
  }),

  http.post("/auth/refresh", async ({ cookies }) => {
    const refreshToken = cookies.refreshToken

    if (!refreshToken) {
      return HttpResponse.json(
        {
          code: "401",
          message: "Refresh token не найден",
        },
        { status: 401 }
      )
    }

    try {
      const session = await verifyToken(refreshToken)
      const user = mockUsers.find((u) => u.id === session.id)

      if (!user) {
        throw new Error("User not found")
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateTokens({
          id: user.id!,
          email: user.email!,
          role: user.role!,
        })

      const response: ApiSchemas["AuthResponse"] = {
        accessToken,
        user,
      }

      return HttpResponse.json(response, {
        status: 200,
        headers: {
          "Set-Cookie": createRefreshTokenCookie(newRefreshToken),
        },
      })
    } catch (error) {
      console.error("Error refreshing token:", error)
      return HttpResponse.json(
        {
          message: "Недействительный refresh token",
          code: "401",
        },
        { status: 401 }
      )
    }
  }),

  http.post("/auth/register", async ({ request }) => {
    const body = (await request.json()) as {
      email: string
      password: string
      name: string
    }

    if (mockUsers.some((u) => u.email === body.email)) {
      return HttpResponse.json(
        {
          message: "Пользователь уже существует",
          code: "400",
        },
        { status: 400 }
      )
    }

    const newUser: ApiSchemas["User"] = {
      id: String(mockUsers.length + 1),
      email: body.email,
      name: body.name,
      role: "patient",
    }

    const { accessToken, refreshToken } = await generateTokens({
      id: newUser.id!,
      email: newUser.email!,
      role: newUser.role!,
    })

    mockUsers.push(newUser)
    userPasswords.set(body.email, body.password)

    const response: ApiSchemas["AuthResponse"] = {
      accessToken,
      user: newUser,
    }

    return HttpResponse.json(response, {
      status: 201,
      headers: {
        "Set-Cookie": createRefreshTokenCookie(refreshToken),
      },
    })
  }),
]
