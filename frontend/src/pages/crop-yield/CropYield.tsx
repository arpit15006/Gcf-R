import { useState } from 'react'
import { Cpu, Database } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { YieldInputForm, type CropYieldInputs, YIELD_PRESETS } from '@/components/crop-yield/YieldInputForm'
import { YieldPredictionResult, type PredictionData } from '@/components/crop-yield/YieldPredictionResult'
import { ErrorBanner } from '@/components/shared/ErrorBanner'

export function CropYield() {
  const [inputs, setInputs] = useState<CropYieldInputs>(YIELD_PRESETS[0].inputs)
  const [prediction, setPrediction] = useState<PredictionData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/models/crop-yield/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      })

      const data = await response.json()

      if (!response.ok || data.status === 'error') {
        throw new Error(data.message || `Server responded with status ${response.status}`)
      }

      setPrediction(data.data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred while running prediction.')
      }
      setPrediction(null)
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
            <span className="text-2xl">📈</span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Crop Yield Prediction
            </h1>
            <Badge variant="default" className="bg-emerald-600 text-white">
              Production ML
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            Forecast harvest yield per acre based on fertilizer application, soil nutrients, and annual precipitation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200">
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span>Dataset: crop_yield_cleaned.csv</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200">
            <Cpu className="h-3.5 w-3.5 text-blue-600" />
            <span>Engine: R Linear Regression</span>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <ErrorBanner message={error} onRetry={handlePredict} />
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-6">
          <Card className="shadow-xs border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">
                Nutrient &amp; Weather Factors
              </CardTitle>
              <CardDescription>
                Adjust field parameters to compute expected harvest tonnage and 95% confidence intervals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YieldInputForm
                inputs={inputs}
                onChange={setInputs}
                onSubmit={handlePredict}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Prediction Results */}
        <div className="lg:col-span-6">
          <YieldPredictionResult
            prediction={prediction}
            emptyMessage="Configure field parameters on the left and submit to query the R Crop Yield model."
          />
        </div>
      </div>
    </div>
  )
}

export default CropYield
