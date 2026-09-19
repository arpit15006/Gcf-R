import { useState } from 'react'
import { Cpu, Database } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CropInputForm, type CropInputValues } from '@/components/crop-recommendation/CropInputForm'
import { CropPredictionResult, type PredictionResultData } from '@/components/crop-recommendation/CropPredictionResult'
import { ErrorBanner } from '@/components/shared/ErrorBanner'

export function CropRecommendationPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [predictionResult, setPredictionResult] = useState<PredictionResultData | null>(null)
  const [lastPayload, setLastPayload] = useState<CropInputValues | null>(null)

  const handlePredict = async (values: CropInputValues) => {
    setIsLoading(true)
    setErrorMessage(null)
    setLastPayload(values)

    try {
      const response = await fetch('/api/models/crop-recommendation/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Failed to retrieve recommendation from backend.`)
      }

      setPredictionResult(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('An unexpected error occurred while communicating with the model.')
      }
      setPredictionResult(null)
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
            <span className="text-2xl">🌱</span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Crop Recommendation
            </h1>
            <Badge variant="default" className="bg-emerald-600 text-white">
              Production ML
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            Determine the most suitable crop based on soil NPK ratios and microclimatic weather variables.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200">
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span>Dataset: Crop_recommendation.csv</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200">
            <Cpu className="h-3.5 w-3.5 text-blue-600" />
            <span>Engine: R rpart Decision Tree</span>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <ErrorBanner message={errorMessage} onRetry={lastPayload ? handleRetry : undefined} />
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-6">
          <Card className="shadow-xs border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Soil &amp; Climate Parameters
              </CardTitle>
              <CardDescription>
                Adjust field macronutrients, soil pH, temperature, humidity, and rainfall to run decision tree inference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CropInputForm onSubmit={handlePredict} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Prediction Results */}
        <div className="lg:col-span-6">
          <CropPredictionResult
            result={predictionResult}
            emptyMessage="Configure soil nutrients and weather values on the left and submit to query the R Crop Recommendation engine."
          />
        </div>
      </div>
    </div>
  )
}

export default CropRecommendationPage
