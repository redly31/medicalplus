import React, { useState } from "react"
import AuthLayout from "./auth-layout"
import { Label } from "@/shared/ui/components/ui/label"
import { Input } from "@/shared/ui/components/ui/input"
import { publicRqClient } from "@/shared/api/instance"
import { useSession } from "@/shared/model/session"

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const login = useSession((state) => state.login)
  const { mutate } = publicRqClient.useMutation("post", "/auth/register", {
    onSuccess: (data) => login(data.accessToken),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ body: { name, email, password } })
  }

  return (
    <AuthLayout
      title="Регистрация"
      onSubmit={handleSubmit}
      submitButtonText="Регистрация"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Почта</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
    </AuthLayout>
  )
}

export default RegisterPage
