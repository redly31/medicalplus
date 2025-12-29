import { AlertCircle, ArrowLeft, Calendar, Clock } from "lucide-react"
import { useLoaderData } from "react-router-dom"
import { Skeleton } from "@/shared/ui/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/shared/ui/components/ui/card"
import { Button } from "@/shared/ui/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/components/ui/dialog"
import { formatDate } from "@/shared/utils/formatDate"
import useDoctorDetailQuery from "../model/use-doctor-detail-query"
import DoctorInfo from "./doctor-info"
import AppointmentsList from "./appointments-list"
import useBook from "../model/use-book"

export default function DoctorDetailPage() {
  const doctorId: string = useLoaderData()
  const {
    handleBookAppointment,
    isBookingDialogOpen,
    setIsBookingDialogOpen,
    selectedAppointment,
    confirmBooking,
  } = useBook(doctorId)
  const { appointments, doctor, isLoading, isError, error } =
    useDoctorDetailQuery(doctorId)

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-5 w-1/2 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка загрузки</AlertTitle>
          <AlertDescription>
            Не удалось загрузить информацию о враче. Пожалуйста, попробуйте
            позже.
            {error && <div className="mt-2 text-sm">{String(error)}</div>}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Врач не найден</AlertTitle>
          <AlertDescription>Информация о враче недоступна.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Назад к списку врачей
      </Button>
      <DoctorInfo doctor={doctor} />

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
        <AppointmentsList
          appointments={appointments}
          handleBookAppointment={handleBookAppointment}
        />
      )}

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение записи</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите записаться на прием к врачу {doctor.name}?
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && appointments && (
            <div className="py-4">
              {(() => {
                const appointment = appointments.find(
                  (apt) => apt.id === selectedAppointment
                )
                if (!appointment) return null
                return (
                  <div className="space-y-2 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatDate(appointment.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBookingDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={confirmBooking}>Записаться</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
