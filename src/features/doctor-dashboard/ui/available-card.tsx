import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/components/ui/card"

type AvailableCardProps = {
  count: number
  title: "Доступно" | "Забронировано" | "Отменено"
  color: "green" | "blue" | "gray"
}

export default function AvailableCard(props: AvailableCardProps) {
  const { title, color, count } = props
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold text-${color}-600`}>{count}</div>
      </CardContent>
    </Card>
  )
}
