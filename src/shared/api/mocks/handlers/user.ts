import { HttpResponse } from "msw"
import { http } from "../http"
import { currentDoctors, currentUsers } from "./admin"
import type { ApiSchemas } from "../../schema"

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
]
