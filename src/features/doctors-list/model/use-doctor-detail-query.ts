import { privateRqClient, publicRqClient } from "@/shared/api/instance"
import { queryClient } from "@/shared/api/query-client"

export default function useDoctorDetailQuery(doctorId: string) {
  const usersQueryOptions = publicRqClient.queryOptions(
    "get",
    "/doctors/{id}/appointments",
    {
      params: {
        path: { id: doctorId },
      },
    }
  )
  const { mutate } = privateRqClient.useMutation(
    "patch",
    "/doctors/{id}/appointments",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: usersQueryOptions.queryKey,
        })
      },
    }
  )

  const {
    data: doctor,
    isLoading,
    isError,
    error,
  } = publicRqClient.useQuery("get", "/doctors/{id}", {
    params: {
      path: { id: doctorId },
    },
  })

  const { data: appointments } = publicRqClient.useQuery(
    "get",
    "/doctors/{id}/appointments",
    {
      ...usersQueryOptions,
      params: {
        path: { id: doctorId },
      },
    }
  )
  return { appointments, doctor, isLoading, isError, error, mutate }
}
