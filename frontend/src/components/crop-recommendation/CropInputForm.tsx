import React, { useState } from 'react'
import { Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export interface CropInputValues {
  N: number
  P: number
  K: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
}

interface CropInputFormProps {
  onSubmit: (values: CropInputValues) => void
  isLoading: boolean
}

const PRESETS: { name: string; values: CropInputValues }[] = [
  {
    name: "Monsoon Rice",
    values: { N: 90, P: 42, K: 43, temperature: 20.9, humidity: 82.0, ph: 6.5, rainfall: 202.9 }
  },
  {
    name: "Dryland Maize",
    values: { N: 78, P: 48, K: 20, temperature: 22.3, humidity: 65.0, ph: 6.2, rainfall: 85.5 }
  },
  {
    name: "High-K Grapes",
    values: { N: 23, P: 132, K: 202, temperature: 23.8, humidity: 81.5, ph: 6.0, rainfall: 69.8 }
  },
  {
    name: "Cotton",
    values: { N: 120, P: 45, K: 20, temperature: 24.5, humidity: 80.0, ph: 6.8, rainfall: 80.0 }
  }
]

export function CropInputForm({ onSubmit, isLoading }: CropInputFormProps) {
  const [n, setN] = useState<number>(90)
  const [p, setP] = useState<number>(42)
  const [k, setK] = useState<number>(43)
  const [temperature, setTemperature] = useState<number>(20.9)
  const [humidity, setHumidity] = useState<number>(82.0)
  const [ph, setPh] = useState<number>(6.5)
  const [rainfall, setRainfall] = useState<number>(202.9)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      N: Number(n),
      P: Number(p),
      K: Number(k),
      temperature: Number(temperature),
      humidity: Number(humidity),
      ph: Number(ph),
      rainfall: Number(rainfall)
    })
  }

  const applyPreset = (vals: CropInputValues) => {
    setN(vals.N)
    setP(vals.P)
    setK(vals.K)
    setTemperature(vals.temperature)
    setHumidity(vals.humidity)
    setPh(vals.ph)
    setRainfall(vals.rainfall)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Field Presets */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Presets:
        </span>
        {PRESETS.map((preset) => (
          <Button
            key={preset.name}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyPreset(preset.values)}
            className="h-7 text-xs px-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
          >
            {preset.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nitrogen (N) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="n-input" className="text-sm font-medium text-slate-700">Nitrogen (N)</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {n} kg/ha
            </span>
          </div>
          <Input
            id="n-input"
            type="number"
            min="0"
            max="140"
            step="1"
            value={n}
            onChange={(e) => setN(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={0}
            max={140}
            step={1}
            value={[n]}
            onValueChange={([val]) => setN(val)}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Phosphorus (P) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="p-input" className="text-sm font-medium text-slate-700">Phosphorus (P)</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {p} kg/ha
            </span>
          </div>
          <Input
            id="p-input"
            type="number"
            min="5"
            max="145"
            step="1"
            value={p}
            onChange={(e) => setP(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={5}
            max={145}
            step={1}
            value={[p]}
            onValueChange={([val]) => setP(val)}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Potassium (K) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="k-input" className="text-sm font-medium text-slate-700">Potassium (K)</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {k} kg/ha
            </span>
          </div>
          <Input
            id="k-input"
            type="number"
            min="5"
            max="205"
            step="1"
            value={k}
            onChange={(e) => setK(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={5}
            max={205}
            step={1}
            value={[k]}
            onValueChange={([val]) => setK(val)}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Soil pH */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="ph-input" className="text-sm font-medium text-slate-700">Soil pH</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {ph} pH
            </span>
          </div>
          <Input
            id="ph-input"
            type="number"
            min="3.5"
            max="10.0"
            step="0.1"
            value={ph}
            onChange={(e) => setPh(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={3.5}
            max={10.0}
            step={0.1}
            value={[ph]}
            onValueChange={([val]) => setPh(Number(val.toFixed(1)))}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="temp-input" className="text-sm font-medium text-slate-700">Temperature</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {temperature} °C
            </span>
          </div>
          <Input
            id="temp-input"
            type="number"
            min="8.0"
            max="45.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={8.0}
            max={45.0}
            step={0.5}
            value={[temperature]}
            onValueChange={([val]) => setTemperature(Number(val.toFixed(1)))}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Humidity */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="humidity-input" className="text-sm font-medium text-slate-700">Relative Humidity</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {humidity} %
            </span>
          </div>
          <Input
            id="humidity-input"
            type="number"
            min="10.0"
            max="100.0"
            step="0.1"
            value={humidity}
            onChange={(e) => setHumidity(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={10.0}
            max={100.0}
            step={1.0}
            value={[humidity]}
            onValueChange={([val]) => setHumidity(Number(val.toFixed(1)))}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Rainfall */}
        <div className="sm:col-span-2 space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="rainfall-input" className="text-sm font-medium text-slate-700">Annual Rainfall</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {rainfall} mm
            </span>
          </div>
          <Input
            id="rainfall-input"
            type="number"
            min="20.0"
            max="300.0"
            step="1.0"
            value={rainfall}
            onChange={(e) => setRainfall(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={20.0}
            max={300.0}
            step={2.0}
            value={[rainfall]}
            onValueChange={([val]) => setRainfall(Number(val.toFixed(1)))}
            disabled={isLoading}
            className="pt-1"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 text-base font-semibold transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Soil &amp; Climate with R Decision Tree...
          </>
        ) : (
          <>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Recommend Suitable Crop
          </>
        )}
      </Button>
    </form>
  )
}
