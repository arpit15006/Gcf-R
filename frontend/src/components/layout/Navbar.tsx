import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { Sprout, Menu, X } from "lucide-react"
import { api } from "@/services/api"

interface NavItem {
  name: string
  path: string
  icon?: string
}

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", path: "/" },
  { name: "Crop Recommendation", path: "/crop-recommendation" },
  { name: "Crop Yield", path: "/crop-yield" },
  { name: "Disease Risk", path: "/disease-risk" },
  { name: "Irrigation", path: "/irrigation" },
  { name: "Weather Risk", path: "/weather-risk" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null)
  const location = useLocation()

  useEffect(() => {
    // Check backend health on mount
    let isMounted = true
    api.checkHealth()
      .then((res) => {
        if (isMounted) setIsBackendHealthy(res.status === "ok")
      })
      .catch(() => {
        if (isMounted) setIsBackendHealthy(false)
      })

    return () => {
      isMounted = false
    }
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 font-bold text-slate-900 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900">
              🌾 Smart Agriculture
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700">
              Intelligence System
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Status Indicator & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            <span
              className={`h-2 w-2 rounded-full ${
                isBackendHealthy === true
                  ? "bg-emerald-500 animate-pulse"
                  : isBackendHealthy === false
                  ? "bg-rose-500"
                  : "bg-amber-400"
              }`}
            />
            <span>
              {isBackendHealthy === true
                ? "API Online"
                : isBackendHealthy === false
                ? "API Offline"
                : "Connecting..."}
            </span>
          </div>

          <button
            type="button"
            className="md:hidden rounded-md p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-base font-medium ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
