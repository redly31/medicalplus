import type { ApiSchemas } from "@/shared/api/schema"

import { Badge } from "@/shared/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/ui/card"
import { Separator } from "@/shared/ui/components/ui/separator"
import {
  Award,
  CheckCircle2,
  FileText,
  GraduationCap,
  Mail,
  Star,
  XCircle,
} from "lucide-react"

export default function DoctorInfo({
  doctor,
}: {
  doctor: ApiSchemas["Doctor"]
}) {
  return (
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
          <h3 className="text-lg font-semibold mb-3">Контактная информация</h3>
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
      </CardContent>
    </Card>
  )
}
