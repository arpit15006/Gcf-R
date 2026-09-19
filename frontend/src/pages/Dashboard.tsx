import { Sparkles, ShieldCheck, CheckCircle2, Layers } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ModelCard } from "@/components/shared/ModelCard"
import type { ModelCardInfo } from "@/types"

const MODEL_CARDS: ModelCardInfo[] = [
  {
    id: "crop-recommendation",
    title: "Crop Recommendation",
    icon: "🌱",
    description: "Find the most suitable crop based on soil and environmental conditions.",
    route: "/crop-recommendation",
    status: "active",
    badgeText: "Active / Deployed",
    owner: "Person 2 (Khushi)",
  },
  {
    id: "crop-yield",
    title: "Crop Yield Prediction",
    icon: "📈",
    description: "Forecast agricultural yield per hectare using historical trends and inputs.",
    route: "/crop-yield",
    status: "active",
    badgeText: "Active / Deployed",
    owner: "Person 3 (Akhil)",
  },
  {
    id: "disease-risk",
    title: "Disease Risk Prediction",
    icon: "🦠",
    description: "Evaluate pathogen susceptibility and disease severity using canopy data and R machine learning.",
    route: "/disease-risk",
    status: "active",
    badgeText: "Active / Deployed",
    owner: "Person 1 + Person 4 (Arpit)",
  },
  {
    id: "irrigation",
    title: "Irrigation Requirement",
    icon: "💧",
    description: "Calculate optimal field watering schedules based on soil moisture and climate.",
    route: "/irrigation",
    status: "active",
    badgeText: "Active / Deployed",
    owner: "Person 5 (Aditya)",
  },
  {
    id: "weather-risk",
    title: "Weather Risk",
    icon: "🌦️",
    description: "Assess adverse microclimate hazards including frost, heat stress, and sudden downpours.",
    route: "/weather-risk",
    status: "development",
    badgeText: "In Development",
    owner: "Person 6",
  },
]

export function Dashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-150">
      {/* Hero / Header Section */}
      <div className="rounded-2xl border border-slate-200 bg-linear-to-b from-white via-white to-emerald-50/30 p-8 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Decision Intelligence for Modern Agronomy
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            🌾 Smart Agriculture Intelligence
          </h1>

          <p className="text-lg text-slate-600 font-medium">
            AI-powered agricultural decision support
          </p>

          <p className="text-sm text-slate-500 leading-relaxed pt-1">
            Integrated ecosystem uniting predictive crop analytics, environmental risk modeling,
            and automated agronomic recommendations across 6 specialized intelligence modules.
          </p>
        </div>

        <Separator className="my-6" />

        {/* Quick System Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Active Modules</div>
              <div className="text-sm font-semibold text-slate-800">4 Operational ML Models</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">API Architecture</div>
              <div className="text-sm font-semibold text-slate-800">Flask REST + R Pipeline</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Team Distribution</div>
              <div className="text-sm font-semibold text-slate-800">6 Modular Subsystems</div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Intelligence Modules
            </h2>
            <p className="text-sm text-slate-500">
              Select any model below to access diagnostics and predictive decision tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODEL_CARDS.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
