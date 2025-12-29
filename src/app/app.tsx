import { Header } from "@/features/header"
import { Outlet } from "react-router-dom"
import "./index.css"

export default function App() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
