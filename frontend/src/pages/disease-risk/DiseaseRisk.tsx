import { useState } from "react"
import { Cpu, Database } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DiseaseInputForm } from "@/components/disease-risk/DiseaseInputForm"
import { DiseaseRiskResult } from "@/components/disease-risk/DiseaseRiskResult"
import { ErrorBanner } from "@/components/shared/ErrorBanner"
import { api } from "@/services/api"
import type { DiseaseRiskRequest, DiseaseRiskResponse } from "@/types"

export function DiseaseRisk() {
  const [result, setResult] = useState<DiseaseRiskResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastPayload, setLastPayload] = useState<DiseaseRiskRequest | null>(null)

  const handlePredict = async (payload: DiseaseRiskRequest) => {
    setIsLoading(true)
    setErrorMessage(null)
    setLastPayload(payload)

    try {
      const response = await api.predictDiseaseRisk(payload)
      setResult(response)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage("An unexpected error occurred during prediction.")
      }
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (lastPayload) {
      handlePredict(lastPayload)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🦠</span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Crop Disease Risk Prediction
            </h1>
            <Badge variant="default" className="bg-emerald-600 text-white">
              Production ML
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            Real-time agro-pathology risk assessment powered by an R Random Forest inference model.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200">
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span>Dataset: plant_disease_data.csv</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200">
            <Cpu className="h-3.5 w-3.5 text-blue-600" />
            <span>Engine: R 4.6</span>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <ErrorBanner message={errorMessage} onRetry={lastPayload ? handleRetry : undefined} />
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Diagnostics Input */}
        <div className="lg:col-span-6">
          <Card className="shadow-xs border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Environmental &amp; Crop Parameters
              </CardTitle>
              <CardDescription>
                Enter observed field canopy metrics to run real-time inference on the active R classifier.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiseaseInputForm onSubmit={handlePredict} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Prediction Results */}
        <div className="lg:col-span-6">
          <DiseaseRiskResult
            result={result}
            emptyMessage="Configure field measurements on the left and submit to query the R Random Forest disease risk engine."
          />
        </div>
      </div>
    </div>
  )
}

export default DiseaseRisk
