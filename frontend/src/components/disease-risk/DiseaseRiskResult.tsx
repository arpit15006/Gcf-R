import { Info, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { RiskIndicator } from "./RiskIndicator"
import type { DiseaseRiskResponse } from "@/types"

interface DiseaseRiskResultProps {
  result: DiseaseRiskResponse | null
  emptyMessage?: string
}

export function DiseaseRiskResult({ result, emptyMessage }: DiseaseRiskResultProps) {
  if (!result) {
    return (
      <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 mb-3 border border-emerald-100">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Awaiting Field Diagnostics
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            {emptyMessage || "Fill in the crop variables and click 'Calculate Disease Risk' to query the R predictive model."}
          </p>
        </CardContent>
      </Card>
    )
  }

  const probPercent = Math.round(result.probability * 100)
  const factors = result.feature_importance
    ? Object.entries(result.feature_importance).sort((a, b) => b[1].percentage - a[1].percentage)
    : []

  return (
    <Card className="border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm uppercase tracking-wider font-semibold text-emerald-400">
            Inference Report
          </h3>
          <p className="text-lg font-bold text-white">
            Disease Prediction
          </p>
        </div>
        <RiskIndicator level={result.risk_level} />
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Core Prediction Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Disease Diagnosis
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{result.prediction}</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Assessed Risk Level
            </div>
            <div className="mt-1">
              <RiskIndicator level={result.risk_level} />
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Model Confidence
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {probPercent}%
            </div>
          </div>
        </div>

        {/* Detailed Class Probabilities if available */}
        {result.probabilities && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Class Probability Distribution
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(result.probabilities).map(([clsName, probVal]) => (
                <div
                  key={clsName}
                  className={`p-2.5 rounded border text-xs ${
                    clsName === result.prediction
                      ? "bg-emerald-50 border-emerald-300 font-semibold text-emerald-900"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="truncate">{clsName}</div>
                  <div className="text-sm font-bold mt-0.5">{Math.round(probVal * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Model Explanation / Important Factors */}
        {factors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Important Factors
              </h4>
              <span className="text-xs text-slate-500">
                Random Forest Gini Contribution
              </span>
            </div>

            <div className="space-y-2.5">
              {factors.map(([key, factor]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{factor.label}</span>
                    <span className="text-slate-500 font-mono font-semibold">
                      {factor.percentage}%
                    </span>
                  </div>
                  {/* Progress Bar Representation */}
                  <Progress
                    value={factor.percentage}
                    className="h-2 bg-slate-100"
                    indicatorClassName="bg-emerald-600"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {result.timestamp && (
          <div className="pt-2 text-[11px] text-slate-400 text-right">
            Model inference executed at: {result.timestamp}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
