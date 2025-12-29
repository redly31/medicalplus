import type { ApiSchemas } from "@/shared/api/schema"
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/shared/ui/components/ui/alert"
import { Button } from "@/shared/ui/components/ui/button"
import { Card, CardHeader, CardContent } from "@/shared/ui/components/ui/card"
import { formatDate } from "@/shared/utils/formatDate"
import { getStatusBadge } from "@/shared/utils/get-status-badge"
import { AlertCircle, Calendar, Clock } from "lucide-react"

export function AppointmentsList({
  appointments,
  onCancel,
}: {
  appointments: ApiSchemas["Appointment"][]
  onCancel: (appointment: ApiSchemas["Appointment"]) => void
}) {
  if (appointments.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Нет записей</AlertTitle>
        <AlertDescription>
          У вас пока нет записей в этой категории.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <Card
          key={appointment.id}
          className="hover:shadow-md transition-shadow"
        >
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-2">
              {getStatusBadge(appointment.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.time}</span>
              </div>
            </div>
            {appointment.status === "booked" && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onCancel(appointment)}
                >
                  Отменить запись
                </Button>
              </div>
            )}

            {appointment.status === "cancelled" && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Запись была отменена
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
