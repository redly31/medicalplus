import type { ApiSchemas } from "@/shared/api/schema"
import { formatDate } from "@/shared/utils/formatDate"
import { Button } from "@/shared/ui/components/ui/button"
import { Calendar, CalendarDays, Clock } from "lucide-react"
import { groupAppointmentsByDate } from "../../../shared/utils/group-appointments-by-date"

type AppointmentsListProps = {
  appointments: ApiSchemas["Appointment"][]
  handleBookAppointment: (appointmentId: string) => Promise<void>
}

export default function AppointmentsList(props: AppointmentsListProps) {
  const { appointments, handleBookAppointment } = props
  const groupedAppointments = appointments
    ? groupAppointmentsByDate(appointments)
    : {}
  const sortedDates = Object.keys(groupedAppointments).sort()
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 mt-6 flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        Доступное время для записи
      </h2>

      <div className="space-y-4">
        {sortedDates.map((date) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(date)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {groupedAppointments[date].map((appointment) => (
                <Button
                  key={appointment.id}
                  variant="outline"
                  className="h-auto py-3 flex flex-col items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleBookAppointment(appointment.id)}
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">{appointment.time}</span>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
