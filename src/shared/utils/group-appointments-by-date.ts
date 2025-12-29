import type { ApiSchemas } from "@/shared/api/schema"

export const groupAppointmentsByDate = (
  appointments: ApiSchemas["Appointment"][]
) => {
  const grouped = appointments.reduce((acc, appointment) => {
    const date = appointment.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(appointment)
    return acc
  }, {} as Record<string, ApiSchemas["Appointment"][]>)

  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => a.time.localeCompare(b.time))
  })

  return grouped
}
