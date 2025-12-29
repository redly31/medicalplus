import { useState } from "react"
import useDoctorAppointments from "./use-doctor-appointments"

export default function useDoctorDashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { mutate } = useDoctorAppointments()
  const [newAppointment, setNewAppointment] = useState({
    date: "",
    time: "",
    status: "available" as "available" | "booked" | "cancelled",
  })

  const handleCreateAppointment = async () => {
    mutate({
      body: newAppointment,
    })
    setIsCreateDialogOpen(false)
    setNewAppointment({ date: "", time: "", status: "available" })
  }
  return {
    handleCreateAppointment,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    newAppointment,
    setNewAppointment,
  }
}
