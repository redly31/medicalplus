import { HttpResponse } from "msw"
import { http } from "../http"
import { mockUsers } from "./auth"
import { verifyRole } from "../session"
import type { ApiSchemas } from "../../schema"

export const currentUsers: ApiSchemas["User"][] = [...mockUsers]
export const currentDoctors = [
  {
    id: "3",
    userId: "3",
    specialization: "Cardiolog",
    licenseNumber: "1488",
    experience: 3,
    education: "UC OSU",
    isActive: true,
  },
]

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

    try {
      await verifyRole(request, ["admin"])
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

    const body = (await request.json()) as {
      role: "patient" | "doctor" | "admin"
      doctorData?: {
        specialization: string
        licenseNumber: string
        experience: number
        bio?: string
        education?: string
      }
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

    if (body.role === "doctor") {
      if (
        !body.doctorData ||
        !body.doctorData.specialization ||
        !body.doctorData.licenseNumber ||
        body.doctorData.experience === undefined
      ) {
        return HttpResponse.json(
          {
            message:
              "Для роли врача необходимо заполнить специализацию, лицензию и опыт",
            code: "400",
          },
          { status: 400 }
        )
      }

      const existingDoctorIndex = currentDoctors.findIndex(
        (d) => d.userId === id
      )

      const newDoctor = {
        id: crypto.randomUUID(),
        userId: id,
        specialization: body.doctorData.specialization,
        licenseNumber: body.doctorData.licenseNumber,
        experience: Number(body.doctorData.experience),
        bio: body.doctorData.bio || "",
        education: body.doctorData.education || "",
        rating: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (existingDoctorIndex > -1) {
        currentDoctors[existingDoctorIndex] = {
          ...currentDoctors[existingDoctorIndex],
          ...newDoctor,
          id: currentDoctors[existingDoctorIndex].id,
        }
      } else {
        currentDoctors.push(newDoctor)
      }
    }

    const updatedUser = {
      ...currentUsers[userIndex],
      role: body.role,
    }

    try {
      currentUsers[userIndex] = updatedUser
      return HttpResponse.json(updatedUser)
    } catch (error) {
      console.error("Error processing role change:", error)
      return HttpResponse.json(
        { message: "Доступ запрещен", code: "403" },
        { status: 403 }
      )
    }
  }),
]
