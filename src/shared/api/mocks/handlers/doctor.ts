import { HttpResponse } from "msw"
import { http } from "../http"
import { verifyRole, verifyToken } from "../session"
import type { ApiSchemas } from "../../schema"

export const mockAppointments: ApiSchemas["Appointment"][] = [
  {
    id: "1",
    doctorId: "3",
    date: "2025-12-28",
    time: "13:00",
    status: "booked",
    patientId: "2",
    patientName: "John",
    createdAt: "28-12-2025",
  },
  {
    id: "2",
    doctorId: "3",
    date: "2025-12-28",
    time: "14:00",
    status: "available",
    createdAt: "28-12-2025",
  },
  {
    id: "3",
    doctorId: "3",
    date: "2025-12-28",
    time: "15:00",
    status: "available",
    createdAt: "28-12-2025",
  },
]

export const doctorHandlers = [
  http.get("/doctor/appointments", async ({ request, cookies }) => {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new HttpResponse(null, { status: 401 })
    }
    const refreshToken = cookies.refreshToken
    const session = await verifyToken(refreshToken)
    try {
      await verifyRole(request, ["doctor"])
      return HttpResponse.json(
        mockAppointments.filter((a) => a.doctorId === session.id)
      )
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
  http.post("/doctor/appointments", async ({ request, cookies }) => {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new HttpResponse(null, { status: 401 })
    }

    const refreshToken = cookies.refreshToken
    const session = await verifyToken(refreshToken)
    const body = (await request.json()) as ApiSchemas["Appointment"]

    const newAppointment = {
      id: String(mockAppointments.length + 1),
      doctorId: session.id,
      date: body.date,
      time: body.time,
      status: body.status,
      createdAt: new Date().toISOString(),
    }

    try {
      await verifyRole(request, ["doctor"])
      mockAppointments.push(newAppointment)
      return HttpResponse.json(mockAppointments)
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
