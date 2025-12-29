import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/components/ui/alert"
import { Card, CardContent, CardHeader } from "@/shared/ui/components/ui/card"
import { Skeleton } from "@/shared/ui/components/ui/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import AvailableCard from "./available-card"
import DashboardHeader from "./dashboard-header"
import { DoctorAppointmentsList } from "./doctor-appointments-list"
import useDoctorAppointments from "../model/use-doctor-appointments"
import { filterAppointments } from "../../../shared/utils/filter-appointments"

export default function DoctorDashboardPage() {
  const { appointments, isLoading, isError, error } = useDoctorAppointments()

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка загрузки</AlertTitle>
          <AlertDescription>
            Не удалось загрузить записи. Пожалуйста, попробуйте позже.
            {error && <div className="mt-2 text-sm">{String(error)}</div>}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const availableCount = filterAppointments({
    appointments,
    status: "available",
  }).length
  const bookedCount = filterAppointments({
    appointments,
    status: "booked",
  }).length
  const cancelledCount = filterAppointments({
    appointments,
    status: "cancelled",
  }).length

  return (
    <div className="mx-auto py-8">
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <AvailableCard color="green" count={availableCount} title="Доступно" />
        <AvailableCard color="blue" count={bookedCount} title="Забронировано" />
        <AvailableCard color="gray" count={cancelledCount} title="Отменено" />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Все записи</TabsTrigger>
          <TabsTrigger value="available">Доступные</TabsTrigger>
          <TabsTrigger value="booked">Забронированные</TabsTrigger>
          <TabsTrigger value="cancelled">Отмененные</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {!appointments || appointments.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Нет записей</AlertTitle>
              <AlertDescription>
                У вас пока нет записей. Создайте первую запись, чтобы начать.
              </AlertDescription>
            </Alert>
          ) : (
            <DoctorAppointmentsList appointments={appointments} />
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <DoctorAppointmentsList
            appointments={filterAppointments({
              appointments,
              status: "available",
            })}
          />
        </TabsContent>

        <TabsContent value="booked" className="space-y-4">
          <DoctorAppointmentsList
            appointments={filterAppointments({
              appointments,
              status: "booked",
            })}
          />
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <DoctorAppointmentsList
            appointments={filterAppointments({
              appointments,
              status: "cancelled",
            })}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
