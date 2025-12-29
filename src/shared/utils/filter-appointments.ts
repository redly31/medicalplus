import type { ApiSchemas } from "@/shared/api/schema"

type filterAppointmentsData = {
  appointments: ApiSchemas["Appointment"][] | undefined
  status: "available" | "booked" | "cancelled"
}
export const filterAppointments = (data: filterAppointmentsData) => {
  const { appointments, status } = data
  if (!appointments) return []
  if (!status) return appointments
  return appointments.filter((apt) => apt.status === status)
}
