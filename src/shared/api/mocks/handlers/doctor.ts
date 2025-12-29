import { HttpResponse } from "msw"
import { http } from "../http"
import { verifyRole, verifyToken } from "../session"
import type { ApiSchemas } from "../../schema"

const appointments: ApiSchemas["Appointment"][] = [
  {
    id: "1",
    doctorId: "3",
    date: "29-12-2025",
    time: "13:00",
    status: "booked",
    patientId: "1",
    patientName: "John",
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
        appointments.filter((a) => a.doctorId === session.id)
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
      id: String(appointments.length + 1),
      doctorId: session.id,
      date: body.date,
      time: body.time,
      status: body.status,
      createdAt: new Date().toISOString(),
    }

    try {
      await verifyRole(request, ["doctor"])
      appointments.push(newAppointment)
      return HttpResponse.json(appointments)
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
