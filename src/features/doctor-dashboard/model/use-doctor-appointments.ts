import { privateRqClient } from "@/shared/api/instance"
import { queryClient } from "@/shared/api/query-client"

export default function useDoctorAppointments() {
  const usersQueryOptions = privateRqClient.queryOptions(
    "get",
    "/doctor/appointments"
  )
  const { mutate } = privateRqClient.useMutation(
    "post",
    "/doctor/appointments",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: usersQueryOptions.queryKey,
        })
      },
    }
  )
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = privateRqClient.useQuery("get", "/doctor/appointments", {
    ...usersQueryOptions,
  })
  return { appointments, isLoading, isError, error, mutate }
}
