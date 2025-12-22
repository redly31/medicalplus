import { Header } from "@/features/header"
import { Outlet } from "react-router-dom"
import "./index.css"

export default function App() {
  return (
    <div className="max-w-5xl mx-auto">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
