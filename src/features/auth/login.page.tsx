import React, { useState } from "react"
import AuthLayout from "./auth-layout"
import { Label } from "@/shared/ui/components/ui/label"
import { Input } from "@/shared/ui/components/ui/input"
import { publicRqClient } from "@/shared/api/instance"
import { useSession } from "@/shared/model/session"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const login = useSession((state) => state.login)
  const { mutate } = publicRqClient.useMutation("post", "/auth/login", {
    onSuccess: (data) => login(data.accessToken),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ body: { email, password } })
  }

  return (
    <AuthLayout title="Войти" onSubmit={handleSubmit} submitButtonText="Войти">
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

export default LoginPage
