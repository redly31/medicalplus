import { Star, GraduationCap, Award, AlertCircle, Badge } from "lucide-react"
import { publicRqClient } from "@/shared/api/instance"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/ui/card"
import { Link } from "react-router-dom"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/components/ui/alert"
import { Skeleton } from "@/shared/ui/components/ui/skeleton"

export default function DoctorsListPage() {
  const {
    data: doctors,
    isLoading,
    isError,
    error,
  } = publicRqClient.useQuery("get", "/doctors")

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Наши врачи</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка загрузки</AlertTitle>
          <AlertDescription>
            Не удалось загрузить список врачей. Пожалуйста, попробуйте позже.
            {error && <div className="mt-2 text-sm">{String(error)}</div>}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Наши врачи</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Врачи не найдены</AlertTitle>
          <AlertDescription>
            В данный момент список врачей пуст.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Наши врачи</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Link
            key={doctor.id}
            to={`/doctors-list/${doctor.id}`}
            className="block h-full"
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">
                      {doctor.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {doctor.specialization}
                    </CardDescription>
                  </div>
                  {!doctor.isActive && (
                    <Badge className="ml-2">Неактивен</Badge>
                  )}
                </div>

                {doctor.rating !== undefined && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {doctor.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>
                    {doctor.experience}{" "}
                    {doctor.experience === 1
                      ? "год"
                      : doctor.experience < 5
                      ? "года"
                      : "лет"}{" "}
                    опыта
                  </span>
                </div>

                {doctor.education && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{doctor.education}</span>
                  </div>
                )}

                {doctor.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                    {doctor.bio}
                  </p>
                )}

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Лицензия: {doctor.licenseNumber}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
