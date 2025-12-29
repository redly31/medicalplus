export const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return "Дата не указана"

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    if (dateString.includes(".")) {
      const [d, m, y] = dateString.split(".")
      const reconstructedDate = new Date(`${y}-${m}-${d}`)
      if (!isNaN(reconstructedDate.getTime())) {
        return format(reconstructedDate)
      }
    }
    return dateString
  }

  return format(date)
}

function format(date: Date) {
  const result = date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  return result.charAt(0).toUpperCase() + result.slice(1)
}
