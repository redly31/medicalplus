import type { ApiSchemas } from "@/shared/api/schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui/components/ui/select"

type UserCardProps = {
  user: ApiSchemas["User"]
  handleRoleSelect: (
    userId: string,
    userName: string,
    currentRole: ApiSchemas["UserRole"],
    newRole: ApiSchemas["UserRole"]
  ) => void
  getRoleLabel: (role: ApiSchemas["UserRole"]) => string
}

export default function UserCard(props: UserCardProps) {
  const { user, handleRoleSelect, getRoleLabel } = props
  return (
    <Card key={user.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{user.name}</CardTitle>
        <CardDescription className="break-all">{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-y-2 flex-col">
          <label className="text-sm font-medium">Роль пользователя</label>
          {user.role === "admin" ? (
            <div className="px-3 py-2 bg-secondary rounded-md text-sm">
              {getRoleLabel(user.role)}
            </div>
          ) : (
            <Select
              value={user.role}
              onValueChange={(newRole: ApiSchemas["UserRole"]) =>
                handleRoleSelect(user.id, user.name, user.role, newRole)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Пациент</SelectItem>
                <SelectItem value="doctor">Врач</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
