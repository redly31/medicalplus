import { Button } from "@/shared/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/ui/card"
import React, { type ReactNode } from "react"

interface AuthLayoutProps {
  title: string
  onSubmit: (e: React.FormEvent) => void
  children: ReactNode
  submitButtonText: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  onSubmit,
  children,
  submitButtonText,
}) => {
  return (
    <div className="flex justify-center mt-32">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {children}
            <Button type="submit" className="w-full">
              {submitButtonText}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthLayout
