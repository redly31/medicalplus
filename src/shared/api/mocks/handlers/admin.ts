import { HttpResponse } from "msw"
import { http } from "../http"
import { mockUsers } from "./auth"
import { verifyRole } from "../session"

const currentUsers = [...mockUsers]

export const adminHandlers = [
  http.get("/admin/users", async ({ request }) => {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new HttpResponse(null, { status: 401 })
    }

    try {
      await verifyRole(request, ["admin"])
      return HttpResponse.json(currentUsers.filter((u) => u.role !== "admin"))
    } catch (error) {
      console.error("Error processing /posts:", error)
      if (error instanceof Response) {
        return error
      }

      return HttpResponse.json(
        {
          message: "Доступ запрещен (недостаточно прав)",
          code: "403",
        },
        { status: 403 }
      )
    }
  }),

  http.patch("/admin/users/{id}/role", async ({ request, params }) => {
    const { id } = params

    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new HttpResponse(null, { status: 401 })
    }

    const body = (await request.json()) as {
      role: "patient" | "doctor" | "admin"
    }

    const allowedRoles = ["patient", "doctor", "admin"]
    if (!allowedRoles.includes(body.role)) {
      return HttpResponse.json(
        { message: "Недопустимая роль", code: "400" },
        { status: 400 }
      )
    }

    const userIndex = currentUsers.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return HttpResponse.json(
        { message: "Пользователь не найден", code: "404" },
        { status: 404 }
      )
    }

    const updatedUser = {
      ...currentUsers[userIndex],
      role: body.role,
    }

    try {
      await verifyRole(request, ["admin"])
      currentUsers[userIndex] = updatedUser
      return HttpResponse.json(updatedUser)
    } catch (error) {
      console.error("Error processing /posts:", error)
      if (error instanceof Response) {
        return error
      }

      return HttpResponse.json(
        {
          message: "Доступ запрещен (недостаточно прав)",
          code: "403",
        },
        { status: 403 }
      )
    }
  }),
]
