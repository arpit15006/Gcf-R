import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, ShieldCheck, Activity, Award, AlertTriangle, CheckCircle2 } from 'lucide-react'

export interface PredictionData {
  predicted_yield: number
  unit: string
  confidence_interval: {
    lower: number
    upper: number
    level: string
  }
  model_metrics: {
    r2: number
    rmse: number
    mae: number
  }
}

interface YieldPredictionResultProps {
  prediction: PredictionData | null
  isLoading: boolean
  error: string | null
}

export const YieldPredictionResult: React.FC<YieldPredictionResultProps> = ({
  prediction,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <Card className="glass-panel border-emerald-900/40 p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <TrendingUp className="w-6 h-6 text-emerald-400 absolute" />
        </div>
        <p className="text-slate-300 font-medium">Computing Regression Estimates in R...</p>
        <p className="text-xs text-slate-500 mt-1">Evaluating 95% prediction intervals & model coefficients</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass-panel border-red-900/50 p-6 bg-red-950/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-red-400">Prediction Failed</h4>
            <p className="text-sm text-slate-300 mt-1">{error}</p>
          </div>
        </div>
      </Card>
    )
  }

  if (!prediction) {
    return (
      <Card className="glass-panel border-slate-800 p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="p-4 rounded-full bg-slate-800/60 text-slate-400 mb-3">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200">Ready to Predict Yield</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Adjust the environmental and soil variables on the left form and click <strong>Predict Crop Yield</strong> to run the R linear regression model.
        </p>
      </Card>
    )
  }

  const { predicted_yield, unit, confidence_interval, model_metrics } = prediction
  const lower = confidence_interval.lower
  const upper = confidence_interval.upper

  // Yield level classification
  let statusBadge = { label: 'Optimal High Yield', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: CheckCircle2 }
  if (predicted_yield < 8.0) {
    statusBadge = { label: 'Low Yield Warning', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: AlertTriangle }
  } else if (predicted_yield >= 8.0 && predicted_yield < 10.5) {
    statusBadge = { label: 'Moderate Yield', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', icon: CheckCircle2 }
  }

  const StatusIcon = statusBadge.icon

  return (
    <Card className="glass-panel glass-panel-hover border-emerald-500/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="pb-3 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-100">Yield Prediction Result</CardTitle>
              <CardDescription>R Multiple Linear Regression Output</CardDescription>
            </div>
          </div>
          <Badge className={`px-3 py-1 text-xs font-semibold flex items-center gap-1.5 ${statusBadge.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {statusBadge.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Main Display Metric */}
        <div className="bg-slate-950/80 rounded-xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Predicted Crop Yield</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {predicted_yield.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-emerald-400">{unit}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Equivalent to ~{(predicted_yield * 100).toFixed(0)} kg/acre
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between gap-4 text-slate-400">
                <span>Model Fit ($R^2$):</span>
                <span className="font-bold text-emerald-400">{(model_metrics.r2 * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-400">
                <span>Root Mean Sq Error:</span>
                <span className="font-bold text-slate-200">±{model_metrics.rmse} {unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 95% Confidence / Prediction Interval Bar */}
        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              95% Prediction Interval ({confidence_interval.level})
            </span>
            <span className="text-slate-400">
              [{lower} - {upper}] {unit}
            </span>
          </div>

          {/* Visual Range bar */}
          <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="absolute h-full bg-gradient-to-r from-emerald-600/40 via-emerald-400 to-teal-500/40 rounded-full"
              style={{
                left: `${Math.max(0, ((lower - 4) / (14 - 4)) * 100)}%`,
                width: `${Math.min(100, ((upper - lower) / (14 - 4)) * 100)}%`,
              }}
            />
            {/* Point estimate marker */}
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-amber-300 shadow-md transform -translate-x-1/2"
              style={{ left: `${Math.max(0, Math.min(100, ((predicted_yield - 4) / (14 - 4)) * 100))}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
            <span>Lower Limit: {lower} {unit}</span>
            <span className="font-medium text-amber-300">Point Est: {predicted_yield} {unit}</span>
            <span>Upper Limit: {upper} {unit}</span>
          </div>
        </div>

        {/* Agronomic Summary Badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block">R Script ML Engine</span>
            <span className="font-semibold text-emerald-400 mt-0.5 block flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Multiple Regression
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Yield Benchmark</span>
            <span className="font-semibold text-slate-200 mt-0.5 block">
              {predicted_yield >= 9.05 ? '+ Above Dataset Avg' : '- Below Dataset Avg'}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 col-span-2 md:col-span-1">
            <span className="text-[11px] text-slate-400 block">Yield Accuracy</span>
            <span className="font-semibold text-cyan-400 mt-0.5 block flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> High Confidence
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
