import { privateRqClient } from "@/shared/api/instance"

export default function DoctorPage() {
  const { data: users } = privateRqClient.useQuery("get", "/admin/users")
  console.log(users)
  return <div>doctor.page</div>
}
