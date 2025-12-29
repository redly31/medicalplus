// useAdminUsers.ts
import { privateRqClient } from "@/shared/api/instance"
import { queryClient } from "@/shared/api/query-client"
import type { ApiSchemas } from "@/shared/api/schema"

export const useAdminUsers = () => {
  const usersQueryOptions = privateRqClient.queryOptions("get", "/admin/users")

  const usersQuery = privateRqClient.useQuery("get", "/admin/users", {
    ...usersQueryOptions,
  })

  const changeUserRoleMutation = privateRqClient.useMutation(
    "patch",
    "/admin/users/{id}/role",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: usersQueryOptions.queryKey,
        })
      },
    }
  )

  const changeUserRole = (
    userId: string,
    body: ApiSchemas["ChangeRoleRequest"]
  ) => {
    changeUserRoleMutation.mutate({
      params: {
        path: { id: userId },
      },
      body: body,
    })
  }

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    changeUserRole,
  }
}
