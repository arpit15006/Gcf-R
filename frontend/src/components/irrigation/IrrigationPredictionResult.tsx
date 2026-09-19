import { Droplets, Info, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

export interface PredictionResult {
  irrigation_need: "Low" | "Medium" | "High"
  confidence: number
  probabilities: {
    Low: number
    Medium: number
    High: number
  }
}

interface IrrigationPredictionResultProps {
  result: PredictionResult | null
  emptyMessage?: string
}

export function IrrigationPredictionResult({ result, emptyMessage }: IrrigationPredictionResultProps) {
  if (!result) {
    return (
      <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 mb-3 border border-emerald-100">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Awaiting Field Moisture Parameters
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            {emptyMessage || "Fill in soil and climate metrics on the left and click 'Calculate Irrigation Requirement' to run inference."}
          </p>
        </CardContent>
      </Card>
    )
  }

  const confidencePercent = Math.round(result.confidence * 100)

  const levelConfigs = {
    Low: {
      badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      variant: "success" as const,
      icon: CheckCircle2,
      rec: "Soil moisture and weather conditions indicate adequate hydration. Standard monitoring recommended."
    },
    Medium: {
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      variant: "warning" as const,
      icon: AlertTriangle,
      rec: "Moderate water deficit approaching. Schedule light localized irrigation within 24 to 48 hours."
    },
    High: {
      badge: "bg-rose-100 text-rose-800 border-rose-300",
      variant: "destructive" as const,
      icon: AlertOctagon,
      rec: "Significant soil moisture depletion detected. Immediate irrigation required to prevent canopy wilting."
    }
  }

  const config = levelConfigs[result.irrigation_need] || levelConfigs.Low
  const Icon = config.icon

  return (
    <Card className="border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm uppercase tracking-wider font-semibold text-emerald-400">
            Inference Report
          </h3>
          <p className="text-lg font-bold text-white">
            Irrigation Requirement
          </p>
        </div>
        <Badge variant={config.variant} className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
          <Icon className="mr-1.5 h-3.5 w-3.5 inline" />
          {result.irrigation_need} Need
        </Badge>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Core Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Assessed Need
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <Droplets className="h-6 w-6 text-blue-600 shrink-0" />
              <span>{result.irrigation_need}</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Action Priority
            </div>
            <div className="text-sm font-bold text-slate-800 mt-2">
              {result.irrigation_need === "High" ? "Immediate Action" : result.irrigation_need === "Medium" ? "Scheduled Cycle" : "Normal Standby"}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Model Confidence
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {confidencePercent}%
            </div>
          </div>
        </div>

        {/* Agronomic Recommendation */}
        <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-4 text-xs text-emerald-950 leading-relaxed">
          <div className="font-semibold text-emerald-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Agronomic Guidance
          </div>
          {config.rec}
        </div>

        {/* Probability Distribution */}
        {result.probabilities && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Requirement Probability Distribution
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(result.probabilities).map(([lvl, prob]) => (
                <div
                  key={lvl}
                  className={`p-2.5 rounded border text-xs ${
                    lvl === result.irrigation_need
                      ? "bg-emerald-50 border-emerald-300 font-semibold text-emerald-900"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="truncate">{lvl} Need</div>
                  <div className="text-sm font-bold mt-0.5">{Math.round(prob * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Water Requirement Spectrum
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between mb-1.5 text-slate-600 font-medium">
                <span>Low Need Probability</span>
                <span className="font-mono font-semibold">{Math.round(result.probabilities.Low * 100)}%</span>
              </div>
              <Progress
                value={result.probabilities.Low * 100}
                className="h-2 bg-slate-100"
                indicatorClassName="bg-emerald-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5 text-slate-600 font-medium">
                <span>Medium Need Probability</span>
                <span className="font-mono font-semibold">{Math.round(result.probabilities.Medium * 100)}%</span>
              </div>
              <Progress
                value={result.probabilities.Medium * 100}
                className="h-2 bg-slate-100"
                indicatorClassName="bg-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5 text-slate-600 font-medium">
                <span>High Need Probability</span>
                <span className="font-mono font-semibold">{Math.round(result.probabilities.High * 100)}%</span>
              </div>
              <Progress
                value={result.probabilities.High * 100}
                className="h-2 bg-slate-100"
                indicatorClassName="bg-rose-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default IrrigationPredictionResult
