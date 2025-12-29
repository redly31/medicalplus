import { privateRqClient } from "@/shared/api/instance"

export default function useProfileAppointmentsQuery() {
  const {
    data: appointments,
    isLoading,
    isError,
  } = privateRqClient.useQuery("get", "/my/appointments")
  return { appointments, isLoading, isError }
}
