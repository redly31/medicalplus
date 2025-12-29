import { useState } from "react"
import useDoctorDetailQuery from "./use-doctor-detail-query"

export default function useBook(doctorId: string) {
  const { mutate } = useDoctorDetailQuery(doctorId)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null
  )
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const handleBookAppointment = async (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setIsBookingDialogOpen(true)
  }
  const confirmBooking = async () => {
    if (!selectedAppointment) return
    mutate(
      {
        params: { path: { id: doctorId } },
        body: { appointmentId: selectedAppointment },
      },
      {
        onSuccess: () => {
          setIsBookingDialogOpen(false)
          setSelectedAppointment(null)
        },
        onError: (err) => {
          console.error("Ошибка при бронировании:", err)
        },
      }
    )
  }

  return {
    isBookingDialogOpen,
    setIsBookingDialogOpen,
    selectedAppointment,
    confirmBooking,
    handleBookAppointment,
  }
}
