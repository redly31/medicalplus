import type { ApiSchemas } from "@/shared/api/schema"
import { Loader2 } from "lucide-react"
import UserCard from "./user-card"
import { useRoleSelect } from "./use-role-select"
import UserRoleConfirm from "./user-role-confirm"

export default function AdminPage() {
  const {
    confirmDialog,
    getRoleLabel,
    setConfirmDialog,
    handleRoleSelect,
    handleCancelRoleChange,
    handleConfirmRoleChange,
    users,
    isLoading,
    isError,
  } = useRoleSelect()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Загрузка пользователей...</p>
      </div>
    )
  }

  if (isError) {
    return <div className="container mx-auto px-4 py-8">Ошибка загрузки</div>
  }

  if (!users || users.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        Нет данных Список пользователей пуст.
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Управление пользователями
        </h1>
        <p className="text-muted-foreground mt-2">
          Всего пользователей: {users.length}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user: ApiSchemas["User"]) => (
          <UserCard
            key={user.id}
            user={user}
            getRoleLabel={getRoleLabel}
            handleRoleSelect={handleRoleSelect}
          />
        ))}
      </div>

      <UserRoleConfirm
        confirmDialog={confirmDialog}
        getRoleLabel={getRoleLabel}
        handleCancelRoleChange={handleCancelRoleChange}
        handleConfirmRoleChange={handleConfirmRoleChange}
        setConfirmDialog={setConfirmDialog}
      />
    </div>
  )
}
