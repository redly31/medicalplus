import type { ApiSchemas } from "@/shared/api/schema"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/components/ui/alert"
import { Button } from "@/shared/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/components/ui/dialog"
import { Skeleton } from "@/shared/ui/components/ui/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/components/ui/tabs"
import { filterAppointments } from "@/shared/utils/filter-appointments"
import { formatDate } from "@/shared/utils/formatDate"
import { AlertCircle, Calendar, Clock } from "lucide-react"
import { useState } from "react"
import { AppointmentsList } from "./user-appointments-list"
import useProfileAppointmentsQuery from "./use-profile-appointments-query"

export default function ProfilePage() {
  const [selectedAppointment, setSelectedAppointment] = useState<
    ApiSchemas["Appointment"] | null
  >(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const { appointments, isLoading, isError } = useProfileAppointmentsQuery()
  const handleCancelAppointment = (appointment: ApiSchemas["Appointment"]) => {
    setSelectedAppointment(appointment)
    setIsCancelDialogOpen(true)
  }

  const confirmCancel = async () => {
    if (!selectedAppointment) return

    console.log("Cancelling appointment:", selectedAppointment.id)

    setIsCancelDialogOpen(false)
    setSelectedAppointment(null)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка загрузки</AlertTitle>
          <AlertDescription>
            Не удалось загрузить ваши записи. Пожалуйста, попробуйте позже.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const bookedCount = filterAppointments({
    appointments,
    status: "booked",
  }).length
  const cancelledCount = filterAppointments({
    appointments,
    status: "cancelled",
  }).length
  const totalCount = appointments?.length || 0

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Мой профиль</h1>
        <p className="text-muted-foreground mt-1">
          Управление вашими записями к врачам
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего записей
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Активные записи
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {bookedCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Отменено
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {cancelledCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Все записи</TabsTrigger>
          <TabsTrigger value="booked">Активные</TabsTrigger>
          <TabsTrigger value="cancelled">Отмененные</TabsTrigger>
        </TabsList>

        {!appointments || appointments.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Нет доступных записей</AlertTitle>
            <AlertDescription>
              В данный момент у врача нет свободного времени для записи.
              Попробуйте позже.
            </AlertDescription>
          </Alert>
        ) : (
          <TabsContent value="all" className="space-y-4">
            <AppointmentsList
              appointments={appointments}
              onCancel={handleCancelAppointment}
            />
          </TabsContent>
        )}

        <TabsContent value="booked" className="space-y-4">
          <AppointmentsList
            appointments={filterAppointments({
              appointments,
              status: "booked",
            })}
            onCancel={handleCancelAppointment}
          />
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <AppointmentsList
            appointments={filterAppointments({
              appointments,
              status: "cancelled",
            })}
            onCancel={handleCancelAppointment}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отменить запись?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отменить эту запись? Это действие нельзя
              будет отменить.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="py-4 space-y-3">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatDate(selectedAppointment.date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {selectedAppointment.time}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Назад
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Отменить запись
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
