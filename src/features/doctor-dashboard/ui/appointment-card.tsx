import type { ApiSchemas } from "@/shared/api/schema"
import { Button } from "@/shared/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/ui/card"
import { Clock, User } from "lucide-react"
import { formatDate } from "../model/format-date"
import { getStatusBadge } from "../model/get-status-badge"

type AppointmentCardProps = {
  appointment: ApiSchemas["Appointment"]
}

export default function AppointmentCard(props: AppointmentCardProps) {
  const { appointment } = props
  return (
    <Card key={appointment.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            {formatDate(appointment.date)}
          </CardTitle>
          {getStatusBadge(appointment.status)}
        </div>
        <CardDescription className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {appointment.time}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {appointment.patientName && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{appointment.patientName}</span>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Создано: {formatDate(appointment.createdAt)}
        </div>
        {appointment.status === "booked" && (
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="flex-1">
              Отменить
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
