import type { ApiSchemas } from "@/shared/api/schema"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/components/ui/alert"
import { AlertCircle } from "lucide-react"
import AppointmentCard from "./appointment-card"

export function DoctorAppointmentsList({
  appointments,
}: {
  appointments: ApiSchemas["Appointment"][]
}) {
  if (appointments.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Нет записей</AlertTitle>
        <AlertDescription>В этой категории нет записей.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {appointments.map((appointment) => (
        <AppointmentCard appointment={appointment} key={appointment.id} />
      ))}
    </div>
  )
}
