import { HttpResponse } from "msw"
import { http } from "../http"
import { currentDoctors, currentUsers } from "./admin"
import type { ApiSchemas } from "../../schema"
import { mockAppointments } from "./doctor"
import { verifyToken } from "../session"

type DoctorWithUser = ApiSchemas["Doctor"] & {
  name: string
  email: string
}

const doctorsListWithNames: DoctorWithUser[] = currentDoctors.map((doctor) => {
  const user = currentUsers.find((u) => u.id === doctor.userId)
  return {
    ...doctor,
    name: user?.name || "Unknown",
    email: user?.email || "",
  }
})

export const userHandlers = [
  http.get("/doctors", async () => {
    return HttpResponse.json(doctorsListWithNames)
  }),

  http.get("/doctors/{id}", async ({ params }) => {
    const { id } = params
    const doctor = doctorsListWithNames.find((doctor) => doctor.id === id)
    return HttpResponse.json(doctor)
  }),

  http.get("/doctors/{id}/appointments", async ({ params }) => {
    const { id } = params
    return HttpResponse.json([
      ...mockAppointments.filter(
        (a) => a.status === "available" && a.doctorId === id
      ),
    ])
  }),

  http.get("/my/appointments", async ({ request, cookies }) => {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return HttpResponse.json(
        { message: "Unauthorized", code: "401" },
        { status: 401 }
      )
    }

    const refreshToken = cookies.refreshToken
    const session = await verifyToken(refreshToken)

    return HttpResponse.json([
      ...mockAppointments.filter(
        (a) => a.status !== "available" && a.patientId === session.id
      ),
    ])
  }),

  http.patch(
    "/doctors/{id}/appointments",
    async ({ params, request, cookies }) => {
      const doctorId = params.id
      const authHeader = request.headers.get("Authorization")

      if (!authHeader) {
        return HttpResponse.json(
          { message: "Unauthorized", code: "401" },
          { status: 401 }
        )
      }

      const refreshToken = cookies.refreshToken
      const session = await verifyToken(refreshToken)

      const { appointmentId } = (await request.json()) as {
        appointmentId: string
      }

      const appointment = mockAppointments.find(
        (a) => a.id === appointmentId && a.doctorId === doctorId
      )

      if (!appointment) {
        return HttpResponse.json(
          { message: "Запись не найдена для данного врача", code: "404" },
          { status: 404 }
        )
      }

      if (appointment.status !== "available") {
        return HttpResponse.json(
          { message: "Слот уже занят или отменен", code: "400" },
          { status: 400 }
        )
      }

      appointment.status = "booked"
      appointment.patientId = session.id
      appointment.patientName = session.name
      console.log(mockAppointments)
      return HttpResponse.json(appointment, { status: 200 })
    }
  ),
]
