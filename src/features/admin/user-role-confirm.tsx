import type { ApiSchemas } from "@/shared/api/schema"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/components/ui/alert-dialog"
import type { RoleChangeConfirmation } from "./use-role-select"

type UserRoleConfirm = {
  confirmDialog: RoleChangeConfirmation | null
  handleCancelRoleChange: () => void
  handleConfirmRoleChange: () => void
  getRoleLabel: (role: ApiSchemas["UserRole"]) => string
}

export default function UserRoleConfirm(props: UserRoleConfirm) {
  const {
    confirmDialog,
    handleCancelRoleChange,
    handleConfirmRoleChange,
    getRoleLabel,
  } = props
  return (
    <AlertDialog
      open={confirmDialog !== null}
      onOpenChange={(open) => !open && handleCancelRoleChange()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Подтверждение изменения роли</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите изменить роль пользователя
            <strong>{confirmDialog?.userName}</strong> с
            <strong>
              {confirmDialog && getRoleLabel(confirmDialog.currentRole)}
            </strong>
            на
            <strong>
              {confirmDialog && getRoleLabel(confirmDialog.newRole)}
            </strong>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelRoleChange}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmRoleChange}>
            Подтвердить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
