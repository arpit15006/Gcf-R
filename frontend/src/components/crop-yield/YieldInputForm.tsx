import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { CloudRain, Thermometer, FlaskConical, Sprout, Sparkles, RefreshCw, Zap } from 'lucide-react'

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
    description: 'Abundant rainfall, balanced nutrients, ideal 28°C climate',
    inputs: { rainfall: 1230, fertilizer: 80, temperature: 28, nitrogen: 80, phosphorus: 25, potassium: 20 }
  },
  {
    name: 'Moderate Climate',
    description: 'Standard seasonal rainfall and average fertilizer application',
    inputs: { rainfall: 850, fertilizer: 70, temperature: 32, nitrogen: 75, phosphorus: 22, potassium: 18 }
  },
  {
    name: 'Low Rainfall / Dry',
    description: 'Reduced precipitation and higher ambient heat',
    inputs: { rainfall: 450, fertilizer: 60, temperature: 38, nitrogen: 65, phosphorus: 15, potassium: 16 }
  }
]

export const YieldInputForm: React.FC<YieldInputFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const handleInputChange = (field: keyof CropYieldInputs, val: number) => {
    onChange({
      ...inputs,
      [field]: val,
    })
  }

  const applyPreset = (presetInputs: CropYieldInputs) => {
    onChange(presetInputs)
  }

  const handleReset = () => {
    onChange(YIELD_PRESETS[0].inputs)
  }

  return (
    <Card className="glass-panel glass-panel-hover border-emerald-900/30">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-100">Agricultural Input Variables</CardTitle>
              <CardDescription>Adjust soil nutrients and environmental parameters for yield regression</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-slate-200">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        </div>

        {/* Preset Selector */}
        <div className="pt-3">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Preset Scenarios
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {YIELD_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset.inputs)}
                className="text-left p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-emerald-500/40 transition-all cursor-pointer group"
              >
                <div className="text-xs font-medium text-emerald-400 group-hover:text-emerald-300">{preset.name}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Environmental Factors */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-cyan-400" /> Environmental Conditions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Rainfall */}
            <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center">
                <Label htmlFor="rainfall" className="text-xs text-slate-300 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Rainfall (mm)
                </Label>
                <Input
                  id="rainfall"
                  type="number"
                  min={400}
                  max={1300}
                  step={10}
                  value={inputs.rainfall}
                  onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value) || 0)}
                  className="w-20 h-7 text-xs text-right bg-slate-900 border-slate-700"
                />
              </div>
              <Slider
                value={[inputs.rainfall]}
                min={400}
                max={1300}
                step={10}
                onValueChange={([val]) => handleInputChange('rainfall', val)}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>400 mm</span>
                <span>1300 mm</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center">
                <Label htmlFor="temperature" className="text-xs text-slate-300 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  min={20}
                  max={45}
                  step={0.5}
                  value={inputs.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                  className="w-20 h-7 text-xs text-right bg-slate-900 border-slate-700"
                />
              </div>
              <Slider
                value={[inputs.temperature]}
                min={20}
                max={45}
                step={0.5}
                onValueChange={([val]) => handleInputChange('temperature', val)}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>20 °C</span>
                <span>45 °C</span>
              </div>
            </div>

            {/* Fertilizer */}
            <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center">
                <Label htmlFor="fertilizer" className="text-xs text-slate-300 flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-400" /> Fertilizer (kg/acre)
                </Label>
                <Input
                  id="fertilizer"
                  type="number"
                  min={50}
                  max={80}
                  step={1}
                  value={inputs.fertilizer}
                  onChange={(e) => handleInputChange('fertilizer', parseFloat(e.target.value) || 0)}
                  className="w-20 h-7 text-xs text-right bg-slate-900 border-slate-700"
                />
              </div>
              <Slider
                value={[inputs.fertilizer]}
                min={50}
                max={80}
                step={1}
                onValueChange={([val]) => handleInputChange('fertilizer', val)}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>50 kg/acre</span>
                <span>80 kg/acre</span>
              </div>
            </div>
          </div>
        </div>

        {/* Soil N-P-K Nutrients */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-emerald-400" /> Soil N-P-K Nutrients (kg/ha)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Nitrogen */}
            <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center">
                <Label htmlFor="nitrogen" className="text-xs text-slate-300 font-medium">
                  Nitrogen (N)
                </Label>
                <Input
                  id="nitrogen"
                  type="number"
                  min={50}
                  max={110}
                  step={1}
                  value={inputs.nitrogen}
                  onChange={(e) => handleInputChange('nitrogen', parseFloat(e.target.value) || 0)}
                  className="w-20 h-7 text-xs text-right bg-slate-900 border-slate-700"
                />
              </div>
              <Slider
                value={[inputs.nitrogen]}
                min={50}
                max={110}
                step={1}
                onValueChange={([val]) => handleInputChange('nitrogen', val)}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>50 N</span>
                <span>110 N</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center">
                <Label htmlFor="phosphorus" className="text-xs text-slate-300 font-medium">
                  Phosphorus (P)
                </Label>
                <Input
                  id="phosphorus"
                  type="number"
                  min={10}
                  max={45}
                  step={1}
                  value={inputs.phosphorus}
                  onChange={(e) => handleInputChange('phosphorus', parseFloat(e.target.value) || 0)}
                  className="w-20 h-7 text-xs text-right bg-slate-900 border-slate-700"
                />
              </div>
              <Slider
                value={[inputs.phosphorus]}
                min={10}
                max={45}
                step={1}
                onValueChange={([val]) => handleInputChange('phosphorus', val)}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10 P</span>
                <span>45 P</span>
              </div>
            </div>

            {/* Potassium */}
            <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between items-center">
                <Label htmlFor="potassium" className="text-xs text-slate-300 font-medium">
                  Potassium (K)
                </Label>
                <Input
                  id="potassium"
                  type="number"
                  min={10}
                  max={25}
                  step={1}
                  value={inputs.potassium}
                  onChange={(e) => handleInputChange('potassium', parseFloat(e.target.value) || 0)}
                  className="w-20 h-7 text-xs text-right bg-slate-900 border-slate-700"
                />
              </div>
              <Slider
                value={[inputs.potassium]}
                min={10}
                max={25}
                step={1}
                onValueChange={([val]) => handleInputChange('potassium', val)}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10 K</span>
                <span>25 K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            size="lg"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-950/50 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Executing R Regression Model...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" /> Predict Crop Yield
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
