// useRoleSelect.ts
import { useState } from "react"
import type { ApiSchemas } from "@/shared/api/schema"
import { useAdminUsers } from "./use-admin-users"

export interface RoleChangeConfirmation {
  userId: string
  userName: string
  currentRole: ApiSchemas["UserRole"]
  newRole: ApiSchemas["UserRole"]
}

export const useRoleSelect = () => {
  const { users, isLoading, isError, changeUserRole } = useAdminUsers()

  const [confirmDialog, setConfirmDialog] =
    useState<RoleChangeConfirmation | null>(null)

  const getRoleLabel = (role: ApiSchemas["UserRole"]): string => {
    const labels: Record<ApiSchemas["UserRole"], string> = {
      patient: "Пациент",
      doctor: "Врач",
      admin: "Администратор",
    }
    return labels[role]
  }

  const handleRoleSelect = (
    userId: string,
    userName: string,
    currentRole: ApiSchemas["UserRole"],
    newRole: ApiSchemas["UserRole"]
  ) => {
    setConfirmDialog({
      userId,
      userName,
      currentRole,
      newRole,
    })
  }

  const handleCancelRoleChange = () => setConfirmDialog(null)

  const handleConfirmRoleChange = () => {
    if (!confirmDialog) return

    changeUserRole(confirmDialog.userId, confirmDialog.newRole)

    setConfirmDialog(null)
  }

  return {
    users,
    isLoading,
    isError,
    confirmDialog,
    setConfirmDialog,
    getRoleLabel,
    handleRoleSelect,
    handleCancelRoleChange,
    handleConfirmRoleChange,
  }
}
