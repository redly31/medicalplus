import { Button } from "@/shared/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/components/ui/dialog"
import { Input } from "@/shared/ui/components/ui/input"
import { Label } from "@/shared/ui/components/ui/label"
import { Plus } from "lucide-react"
import useDoctorDashboard from "../model/use-doctor-dashboard"

export default function DashboardHeader() {
  const {
    handleCreateAppointment,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    newAppointment,
    setNewAppointment,
  } = useDoctorDashboard()
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Панель врача</h1>
        <p className="text-muted-foreground mt-1">
          Управление записями на прием
        </p>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать запись
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Новая запись</DialogTitle>
            <DialogDescription>
              Создайте доступное время для записи пациентов
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                type="date"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    date: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Время</Label>
              <Input
                id="time"
                type="time"
                value={newAppointment.time}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    time: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleCreateAppointment}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
