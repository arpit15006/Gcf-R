import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌾 Smart Agriculture Intelligence Platform</span>
          <span className="text-slate-400">
            Person 1 (Dashboard & Navigation) &amp; Person 4 (Backend &amp; Disease Model)
          </span>
        </div>
      </footer>
    </div>
  )
}
