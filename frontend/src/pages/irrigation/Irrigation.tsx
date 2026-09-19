import { useState } from "react"
import { Cpu, Database } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import IrrigationInputForm, {
  SAMPLE_PRESETS,
  type IrrigationFormData,
} from "@/components/irrigation/IrrigationInputForm"
import IrrigationPredictionResult, {
  type PredictionResult,
} from "@/components/irrigation/IrrigationPredictionResult"
import { ErrorBanner } from "@/components/shared/ErrorBanner"

const API_URL = "/api/models/irrigation/predict"

export function Irrigation() {
  const [formData, setFormData] = useState<IrrigationFormData>(SAMPLE_PRESETS[0].values)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    // Validation
    if (!formData.Crop_Type || !formData.Soil_Type || !formData.Crop_Growth_Stage || !formData.Region) {
      setError("Please select Crop, Soil Type, Growth Stage, and Region before submitting.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        const msg = body.details?.join("; ") || body.error || `Server responded with status ${response.status}`
        throw new Error(msg)
      }

      const prediction: PredictionResult = await response.json()
      setResult(prediction)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during prediction.")
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">💧</span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Irrigation Requirement Prediction
            </h1>
            <Badge variant="default" className="bg-emerald-600 text-white">
              Production ML
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            Determine field watering necessity (Low / Medium / High) based on soil moisture and ambient conditions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200">
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span>Dataset: irrigation_prediction.csv</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200">
            <Cpu className="h-3.5 w-3.5 text-blue-600" />
            <span>Engine: R Ranger Random Forest</span>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <ErrorBanner message={error} onRetry={handleSubmit} />
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-6">
          <Card className="shadow-xs border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Hydrological &amp; Agronomic Factors
              </CardTitle>
              <CardDescription>
                Configure soil moisture, crop stage, and climate metrics to calculate watering schedules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IrrigationInputForm
                formData={formData}
                onChange={setFormData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Prediction Results */}
        <div className="lg:col-span-6">
          <IrrigationPredictionResult
            result={result}
            emptyMessage="Configure field moisture and crop factors on the left and submit to query the R Ranger model."
          />
        </div>
      </div>
    </div>
  )
}

export default Irrigation
