import { TrendingUp, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
  inputs: {
    rainfall: number
    fertilizer: number
    temperature: number
    nitrogen: number
    phosphorus: number
    potassium: number
  }
}

interface YieldPredictionResultProps {
  prediction: PredictionData | null
  emptyMessage?: string
}

export function YieldPredictionResult({ prediction, emptyMessage }: YieldPredictionResultProps) {
  if (!prediction) {
    return (
      <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 mb-3 border border-emerald-100">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Awaiting Field &amp; Soil Inputs
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            {emptyMessage || "Fill in rainfall, fertilizer, and nutrient variables and click 'Predict Harvest Yield' to run inference."}
          </p>
        </CardContent>
      </Card>
    )
  }

  const { predicted_yield, unit, confidence_interval, model_metrics } = prediction
  const lower = confidence_interval.lower
  const upper = confidence_interval.upper

  return (
    <Card className="border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm uppercase tracking-wider font-semibold text-emerald-400">
            Inference Report
          </h3>
          <p className="text-lg font-bold text-white">
            Crop Yield Forecast
          </p>
        </div>
        <Badge variant="default" className="bg-emerald-600 text-white px-3 py-1 font-bold">
          R² = {(model_metrics.r2 * 100).toFixed(1)}% FIT
        </Badge>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Core Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Estimated Yield
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <TrendingUp className="h-6 w-6 text-emerald-600 shrink-0" />
              <span>{predicted_yield.toFixed(2)}</span>
              <span className="text-xs font-semibold text-slate-500">{unit}</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Confidence Interval
            </div>
            <div className="text-sm font-bold text-slate-800 mt-2">
              [{lower.toFixed(2)} - {upper.toFixed(2)}] {unit}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              95% Prediction Range
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Model Accuracy
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {Math.round(model_metrics.r2 * 100)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              RMSE: {model_metrics.rmse.toFixed(3)}
            </div>
          </div>
        </div>

        {/* Statistical Performance Metrics */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Model Validation Metrics
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-400 block font-medium">Coefficient of Determination</span>
              <span className="text-base font-bold text-slate-800">R² = {model_metrics.r2.toFixed(4)}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-400 block font-medium">Root Mean Squared Error</span>
              <span className="text-base font-bold text-slate-800">RMSE = {model_metrics.rmse.toFixed(4)}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-400 block font-medium">Mean Absolute Error</span>
              <span className="text-base font-bold text-slate-800">MAE = {model_metrics.mae.toFixed(4)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Factors & Inputs Snapshot */}
        {prediction.inputs && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Field Conditions Recorded
              </h4>
              <span className="text-xs text-slate-500">
                Input Feature Snapshot
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Rainfall</span>
                <span className="font-semibold text-slate-800">{prediction.inputs.rainfall} mm</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Fertilizer</span>
                <span className="font-semibold text-slate-800">{prediction.inputs.fertilizer} kg/acre</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Temperature</span>
                <span className="font-semibold text-slate-800">{prediction.inputs.temperature} °C</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Nitrogen</span>
                <span className="font-semibold text-slate-800">{prediction.inputs.nitrogen} kg/ha</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Phosphorus</span>
                <span className="font-semibold text-slate-800">{prediction.inputs.phosphorus} kg/ha</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Potassium</span>
                <span className="font-semibold text-slate-800">{prediction.inputs.potassium} kg/ha</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
