import { useState, type Dispatch, type SetStateAction } from "react"
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

export type DoctorFormData = {
  specialization: string
  licenseNumber: string
  experience: number
  bio: string
  education: string
}

type UserRoleConfirmProps = {
  confirmDialog: RoleChangeConfirmation | null
  handleCancelRoleChange: () => void
  handleConfirmRoleChange: (doctorData?: DoctorFormData) => void
  getRoleLabel: (role: ApiSchemas["UserRole"]) => string
  setConfirmDialog: Dispatch<SetStateAction<RoleChangeConfirmation | null>>
}

export default function UserRoleConfirm(props: UserRoleConfirmProps) {
  const {
    confirmDialog,
    handleCancelRoleChange,
    handleConfirmRoleChange,
    getRoleLabel,
  } = props

  const [formData, setFormData] = useState<DoctorFormData>({
    specialization: "",
    licenseNumber: "",
    experience: 0,
    bio: "",
    education: "",
  })

  const isDoctorRole = confirmDialog?.newRole === "doctor"

  const handleChange = (
    field: keyof DoctorFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const onConfirm = (e: React.MouseEvent) => {
    if (isDoctorRole) {
      if (!formData.specialization || !formData.licenseNumber) {
        e.preventDefault()
        alert(
          "Пожалуйста, заполните обязательные поля (Специализация, Лицензия)"
        )
        return
      }

      handleConfirmRoleChange(formData)
    } else {
      handleConfirmRoleChange()
    }
  }

  return (
    <AlertDialog
      open={confirmDialog !== null}
      onOpenChange={(open) => !open && handleCancelRoleChange()}
    >
      <AlertDialogContent className={isDoctorRole ? "max-w-xl" : ""}>
        <AlertDialogHeader>
          <AlertDialogTitle>Подтверждение изменения роли</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите изменить роль пользователя{" "}
            <strong>{confirmDialog?.userName}</strong> с{" "}
            <strong>
              {confirmDialog && getRoleLabel(confirmDialog.currentRole)}
            </strong>{" "}
            на{" "}
            <strong>
              {confirmDialog && getRoleLabel(confirmDialog.newRole)}
            </strong>
            ?
          </AlertDialogDescription>

          {isDoctorRole && (
            <div className="grid gap-4 py-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Специализация *
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Кардиолог"
                    value={formData.specialization}
                    onChange={(e) =>
                      handleChange("specialization", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Номер лицензии *
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="MD-12345"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      handleChange("licenseNumber", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Опыт (лет)
                </label>
                <input
                  type="number"
                  min="0"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.experience}
                  onChange={(e) =>
                    handleChange("experience", Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Образование
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Название ВУЗа"
                  value={formData.education}
                  onChange={(e) => handleChange("education", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Биография
                </label>
                <textarea
                  className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Краткая информация о враче"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              </div>
            </div>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelRoleChange}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Подтвердить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
