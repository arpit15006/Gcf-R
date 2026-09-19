import React, { useState, useEffect } from 'react'
import { YieldInputForm, type CropYieldInputs, YIELD_PRESETS } from '@/components/crop-yield/YieldInputForm'
import { YieldPredictionResult, type PredictionData } from '@/components/crop-yield/YieldPredictionResult'
import { YieldChart } from '@/components/crop-yield/YieldChart'
import { Badge } from '@/components/ui/badge'
import { Sprout, Activity, Cpu, Sparkles } from 'lucide-react'

export const CropYield: React.FC = () => {
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
    } catch (err: any) {
      console.error('Crop Yield Prediction Error:', err)
      setError(err.message || 'An unexpected error occurred while running prediction.')
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger initial prediction on page load
  useEffect(() => {
    handlePredict()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
                  Crop Yield Prediction
                </h1>
                <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  PERSON 3
                </Badge>
              </div>
              <p className="text-sm text-slate-400">
                Machine Learning Regression Dashboard powered by R (`lm`), Flask REST API & React
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-300">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Engine: <strong>Rscript lm Model</strong></span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-300">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Unit: <strong>Q/acre</strong></span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form (5 cols) */}
        <section className="lg:col-span-5 space-y-6">
          <YieldInputForm
            inputs={inputs}
            onChange={setInputs}
            onSubmit={handlePredict}
            isLoading={isLoading}
          />
        </section>

        {/* Right Column: Prediction Card & Charts (7 cols) */}
        <section className="lg:col-span-7 space-y-6">
          <YieldPredictionResult
            prediction={prediction}
            isLoading={isLoading}
            error={error}
          />

          <YieldChart
            inputs={inputs}
            prediction={prediction}
          />
        </section>
      </main>

      {/* Page Footer */}
      <footer className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
        <p>Smart Agriculture Intelligence Dashboard • PERSON 3 Ownership (`models/crop_yield/`)</p>
        <p className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> R Multiple Linear Regression ($R^2 = 89.48\%$)
        </p>
      </footer>
    </div>
  )
}

export default CropYield
