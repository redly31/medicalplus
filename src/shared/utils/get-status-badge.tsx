import { Badge } from "@/shared/ui/components/ui/badge"
import { CalendarClock, CheckCircle2, XCircle } from "lucide-react"

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "available":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Доступно
        </Badge>
      )
    case "booked":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          <CalendarClock className="h-3 w-3 mr-1" />
          Забронировано
        </Badge>
      )
    case "cancelled":
      return (
        <Badge variant="secondary">
          <XCircle className="h-3 w-3 mr-1" />
          Отменено
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}
