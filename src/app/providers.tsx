import { queryClient } from "@/shared/api/query-client"
import { ThemeProvider } from "@/shared/ui/theme/theme-provider"
import { QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  )
}
