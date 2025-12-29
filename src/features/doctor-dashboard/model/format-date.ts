export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
