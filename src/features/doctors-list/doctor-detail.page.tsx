import {
  Star,
  GraduationCap,
  Award,
  AlertCircle,
  Mail,
  FileText,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { publicRqClient } from "@/shared/api/instance"
import { useLoaderData } from "react-router-dom"
import { Skeleton } from "@/shared/ui/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/ui/card"
import { Button } from "@/shared/ui/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/components/ui/alert"
import { Badge } from "@/shared/ui/components/ui/badge"
import { Separator } from "@/shared/ui/components/ui/separator"

export default function DoctorDetailPage() {
  const doctorId: string = useLoaderData()
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-5 w-1/2 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка загрузки</AlertTitle>
          <AlertDescription>
            Не удалось загрузить информацию о враче. Пожалуйста, попробуйте
            позже.
            {error && <div className="mt-2 text-sm">{String(error)}</div>}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Врач не найден</AlertTitle>
          <AlertDescription>Информация о враче недоступна.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Назад к списку врачей
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{doctor.name}</CardTitle>
              <CardDescription className="text-lg">
                {doctor.specialization}
              </CardDescription>
            </div>

            <div className="flex gap-2 items-start">
              {doctor.isActive ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Активен
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="h-3 w-3 mr-1" />
                  Неактивен
                </Badge>
              )}

              {doctor.rating !== undefined && (
                <Badge variant="outline" className="bg-yellow-50">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {doctor.rating.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4" />
              <span className="text-sm">
                {doctor.experience}{" "}
                {doctor.experience === 1
                  ? "год"
                  : doctor.experience < 5
                  ? "года"
                  : "лет"}{" "}
                опыта
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Лицензия: {doctor.licenseNumber}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          {doctor.bio && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5" />О враче
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {doctor.bio}
              </p>
            </div>
          )}

          {doctor.education && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Образование
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {doctor.education}
              </p>
            </div>
          )}

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Контактная информация
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${doctor.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {doctor.email}
                </a>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button className="flex-1">Записаться на прием</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
