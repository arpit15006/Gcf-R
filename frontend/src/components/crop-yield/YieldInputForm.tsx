import React from 'react'
import { Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export interface CropYieldInputs {
  rainfall: number
  fertilizer: number
  temperature: number
  nitrogen: number
  phosphorus: number
  potassium: number
}

interface YieldInputFormProps {
  inputs: CropYieldInputs
  onChange: (inputs: CropYieldInputs) => void
  onSubmit: () => void
  isLoading: boolean
}

export const YIELD_PRESETS = [
  {
    name: 'High Yield Optimal',
    inputs: { rainfall: 1230, fertilizer: 80, temperature: 28, nitrogen: 80, phosphorus: 25, potassium: 20 }
  },
  {
    name: 'Moderate Climate',
    inputs: { rainfall: 850, fertilizer: 70, temperature: 32, nitrogen: 75, phosphorus: 22, potassium: 18 }
  },
  {
    name: 'Low Rainfall / Dry',
    inputs: { rainfall: 450, fertilizer: 60, temperature: 38, nitrogen: 65, phosphorus: 15, potassium: 16 }
  }
]

export function YieldInputForm({
  inputs,
  onChange,
  onSubmit,
  isLoading,
}: YieldInputFormProps) {
  const handleInputChange = (field: keyof CropYieldInputs, val: number) => {
    onChange({
      ...inputs,
      [field]: val,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Field Presets */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Presets:
        </span>
        {YIELD_PRESETS.map((preset) => (
          <Button
            key={preset.name}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(preset.inputs)}
            className="h-7 text-xs px-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
          >
            {preset.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Rainfall */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="yield-rainfall" className="text-sm font-medium text-slate-700">Annual Rainfall</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {inputs.rainfall} mm
            </span>
          </div>
          <Input
            id="yield-rainfall"
            type="number"
            min="300"
            max="2000"
            step="10"
            value={inputs.rainfall}
            onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={300}
            max={2000}
            step={10}
            value={[inputs.rainfall]}
            onValueChange={([val]) => handleInputChange('rainfall', val)}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Fertilizer Application */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="yield-fertilizer" className="text-sm font-medium text-slate-700">Fertilizer Used</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {inputs.fertilizer} kg/acre
            </span>
          </div>
          <Input
            id="yield-fertilizer"
            type="number"
            min="10"
            max="150"
            step="1"
            value={inputs.fertilizer}
            onChange={(e) => handleInputChange('fertilizer', parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={10}
            max={150}
            step={1}
            value={[inputs.fertilizer]}
            onValueChange={([val]) => handleInputChange('fertilizer', val)}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="yield-temp" className="text-sm font-medium text-slate-700">Temperature</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {inputs.temperature} °C
            </span>
          </div>
          <Input
            id="yield-temp"
            type="number"
            min="15"
            max="45"
            step="0.5"
            value={inputs.temperature}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={15}
            max={45}
            step={0.5}
            value={[inputs.temperature]}
            onValueChange={([val]) => handleInputChange('temperature', Number(val.toFixed(1)))}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Nitrogen */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="yield-n" className="text-sm font-medium text-slate-700">Nitrogen Ratio</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {inputs.nitrogen} kg/ha
            </span>
          </div>
          <Input
            id="yield-n"
            type="number"
            min="20"
            max="140"
            step="1"
            value={inputs.nitrogen}
            onChange={(e) => handleInputChange('nitrogen', parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={20}
            max={140}
            step={1}
            value={[inputs.nitrogen]}
            onValueChange={([val]) => handleInputChange('nitrogen', val)}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Phosphorus */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="yield-p" className="text-sm font-medium text-slate-700">Phosphorus Ratio</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {inputs.phosphorus} kg/ha
            </span>
          </div>
          <Input
            id="yield-p"
            type="number"
            min="5"
            max="60"
            step="1"
            value={inputs.phosphorus}
            onChange={(e) => handleInputChange('phosphorus', parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={5}
            max={60}
            step={1}
            value={[inputs.phosphorus]}
            onValueChange={([val]) => handleInputChange('phosphorus', val)}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Potassium */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="yield-k" className="text-sm font-medium text-slate-700">Potassium Ratio</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {inputs.potassium} kg/ha
            </span>
          </div>
          <Input
            id="yield-k"
            type="number"
            min="5"
            max="50"
            step="1"
            value={inputs.potassium}
            onChange={(e) => handleInputChange('potassium', parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={5}
            max={50}
            step={1}
            value={[inputs.potassium]}
            onValueChange={([val]) => handleInputChange('potassium', val)}
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
            Forecasting Harvest Yield with R Model...
          </>
        ) : (
          <>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Predict Harvest Yield
          </>
        )}
      </Button>
    </form>
  )
}
