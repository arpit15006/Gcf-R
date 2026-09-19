import React from 'react'
import { Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface IrrigationFormData {
  Soil_Type: string
  Soil_pH: number | ""
  Soil_Moisture: number | ""
  Organic_Carbon: number | ""
  Electrical_Conductivity: number | ""
  Temperature_C: number | ""
  Humidity: number | ""
  Rainfall_mm: number | ""
  Sunlight_Hours: number | ""
  Wind_Speed_kmh: number | ""
  Crop_Type: string
  Crop_Growth_Stage: string
  Season: string
  Irrigation_Type: string
  Water_Source: string
  Field_Area_hectare: number | ""
  Mulching_Used: string
  Previous_Irrigation_mm: number | ""
  Region: string
}

export const SAMPLE_PRESETS: { name: string; values: IrrigationFormData }[] = [
  {
    name: "Wheat (North Rabi)",
    values: {
      Soil_Type: "Loamy",
      Soil_pH: 6.5,
      Soil_Moisture: 35.0,
      Organic_Carbon: 0.65,
      Electrical_Conductivity: 1.5,
      Temperature_C: 22.0,
      Humidity: 45.0,
      Rainfall_mm: 15.0,
      Sunlight_Hours: 8.0,
      Wind_Speed_kmh: 12.0,
      Crop_Type: "Wheat",
      Crop_Growth_Stage: "Vegetative",
      Season: "Rabi",
      Irrigation_Type: "Drip",
      Water_Source: "Groundwater",
      Field_Area_hectare: 2.5,
      Mulching_Used: "Yes",
      Previous_Irrigation_mm: 20.0,
      Region: "North",
    }
  },
  {
    name: "Rice (East Kharif)",
    values: {
      Soil_Type: "Clay",
      Soil_pH: 6.0,
      Soil_Moisture: 65.0,
      Organic_Carbon: 0.85,
      Electrical_Conductivity: 1.2,
      Temperature_C: 29.0,
      Humidity: 82.0,
      Rainfall_mm: 180.0,
      Sunlight_Hours: 6.5,
      Wind_Speed_kmh: 10.0,
      Crop_Type: "Rice",
      Crop_Growth_Stage: "Vegetative",
      Season: "Kharif",
      Irrigation_Type: "Canal",
      Water_Source: "River",
      Field_Area_hectare: 4.0,
      Mulching_Used: "No",
      Previous_Irrigation_mm: 50.0,
      Region: "East",
    }
  },
  {
    name: "Maize (South Zaid)",
    values: {
      Soil_Type: "Sandy",
      Soil_pH: 7.2,
      Soil_Moisture: 25.0,
      Organic_Carbon: 0.4,
      Electrical_Conductivity: 1.8,
      Temperature_C: 34.0,
      Humidity: 35.0,
      Rainfall_mm: 5.0,
      Sunlight_Hours: 9.5,
      Wind_Speed_kmh: 18.0,
      Crop_Type: "Maize",
      Crop_Growth_Stage: "Flowering",
      Season: "Zaid",
      Irrigation_Type: "Sprinkler",
      Water_Source: "Reservoir",
      Field_Area_hectare: 1.8,
      Mulching_Used: "Yes",
      Previous_Irrigation_mm: 15.0,
      Region: "South",
    }
  }
]

const SOIL_TYPES = ["Clay", "Loamy", "Sandy", "Silt"]
const CROP_TYPES = ["Cotton", "Maize", "Potato", "Rice", "Sugarcane", "Wheat"]
const GROWTH_STAGES = ["Flowering", "Harvest", "Sowing", "Vegetative"]
const SEASONS = ["Kharif", "Rabi", "Zaid"]
const IRRIGATION_TYPES = ["Canal", "Drip", "Rainfed", "Sprinkler"]
const WATER_SOURCES = ["Groundwater", "Rainwater", "Reservoir", "River"]
const MULCHING_OPTIONS = ["Yes", "No"]
const REGIONS = ["Central", "East", "North", "South", "West"]

interface IrrigationInputFormProps {
  formData: IrrigationFormData
  onChange: (data: IrrigationFormData) => void
  onSubmit: () => void
  isLoading: boolean
}

export function IrrigationInputForm({
  formData,
  onChange,
  onSubmit,
  isLoading,
}: IrrigationInputFormProps) {
  const updateField = <K extends keyof IrrigationFormData>(
    key: K,
    value: IrrigationFormData[K]
  ) => {
    onChange({ ...formData, [key]: value })
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
        {SAMPLE_PRESETS.map((preset) => (
          <Button
            key={preset.name}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(preset.values)}
            className="h-7 text-xs px-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
          >
            {preset.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Crop Type */}
        <div className="space-y-2">
          <Label htmlFor="irr-crop" className="text-sm font-medium text-slate-700">
            Crop Species <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={formData.Crop_Type}
            onValueChange={(val) => updateField("Crop_Type", val)}
            disabled={isLoading}
          >
            <SelectTrigger id="irr-crop" className="w-full">
              <SelectValue placeholder="Select crop species" />
            </SelectTrigger>
            <SelectContent>
              {CROP_TYPES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Soil Type */}
        <div className="space-y-2">
          <Label htmlFor="irr-soil" className="text-sm font-medium text-slate-700">
            Soil Texture <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={formData.Soil_Type}
            onValueChange={(val) => updateField("Soil_Type", val)}
            disabled={isLoading}
          >
            <SelectTrigger id="irr-soil" className="w-full">
              <SelectValue placeholder="Select soil texture" />
            </SelectTrigger>
            <SelectContent>
              {SOIL_TYPES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Growth Stage */}
        <div className="space-y-2">
          <Label htmlFor="irr-stage" className="text-sm font-medium text-slate-700">
            Growth Stage <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={formData.Crop_Growth_Stage}
            onValueChange={(val) => updateField("Crop_Growth_Stage", val)}
            disabled={isLoading}
          >
            <SelectTrigger id="irr-stage" className="w-full">
              <SelectValue placeholder="Select growth stage" />
            </SelectTrigger>
            <SelectContent>
              {GROWTH_STAGES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <Label htmlFor="irr-region" className="text-sm font-medium text-slate-700">
            Geographic Region <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={formData.Region}
            onValueChange={(val) => updateField("Region", val)}
            disabled={isLoading}
          >
            <SelectTrigger id="irr-region" className="w-full">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Soil Moisture */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="irr-moisture" className="text-sm font-medium text-slate-700">Soil Moisture (%)</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {formData.Soil_Moisture || 0}%
            </span>
          </div>
          <Input
            id="irr-moisture"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={formData.Soil_Moisture}
            onChange={(e) => updateField("Soil_Moisture", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 35"
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="irr-temp" className="text-sm font-medium text-slate-700">Temperature (°C)</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {formData.Temperature_C || 0} °C
            </span>
          </div>
          <Input
            id="irr-temp"
            type="number"
            min="5"
            max="55"
            step="0.5"
            value={formData.Temperature_C}
            onChange={(e) => updateField("Temperature_C", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 24"
          />
        </div>

        {/* Humidity */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="irr-humidity" className="text-sm font-medium text-slate-700">Air Humidity (%)</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {formData.Humidity || 0}%
            </span>
          </div>
          <Input
            id="irr-humidity"
            type="number"
            min="10"
            max="100"
            step="1"
            value={formData.Humidity}
            onChange={(e) => updateField("Humidity", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 60"
          />
        </div>

        {/* Rainfall */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="irr-rain" className="text-sm font-medium text-slate-700">Rainfall (mm)</Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {formData.Rainfall_mm || 0} mm
            </span>
          </div>
          <Input
            id="irr-rain"
            type="number"
            min="0"
            max="500"
            step="1"
            value={formData.Rainfall_mm}
            onChange={(e) => updateField("Rainfall_mm", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 20"
          />
        </div>

        {/* Soil pH */}
        <div className="space-y-2">
          <Label htmlFor="irr-ph" className="text-sm font-medium text-slate-700">Soil pH</Label>
          <Input
            id="irr-ph"
            type="number"
            min="3"
            max="11"
            step="0.1"
            value={formData.Soil_pH}
            onChange={(e) => updateField("Soil_pH", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 6.5"
          />
        </div>

        {/* Sunlight Hours */}
        <div className="space-y-2">
          <Label htmlFor="irr-sunlight" className="text-sm font-medium text-slate-700">Sunlight (hours/day)</Label>
          <Input
            id="irr-sunlight"
            type="number"
            min="0"
            max="16"
            step="0.5"
            value={formData.Sunlight_Hours}
            onChange={(e) => updateField("Sunlight_Hours", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 8.0"
          />
        </div>

        {/* Season & Irrigation System */}
        <div className="space-y-2">
          <Label htmlFor="irr-season" className="text-sm font-medium text-slate-700">Agricultural Season</Label>
          <Select
            value={formData.Season}
            onValueChange={(val) => updateField("Season", val)}
            disabled={isLoading}
          >
            <SelectTrigger id="irr-season" className="w-full">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="irr-sys" className="text-sm font-medium text-slate-700">Irrigation System</Label>
          <Select
            value={formData.Irrigation_Type}
            onValueChange={(val) => updateField("Irrigation_Type", val)}
            disabled={isLoading}
          >
            <SelectTrigger id="irr-sys" className="w-full">
              <SelectValue placeholder="Select system type" />
            </SelectTrigger>
            <SelectContent>
              {IRRIGATION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Water Source & Mulching */}
        <div className="space-y-2">
          <Label htmlFor="irr-source" className="text-sm font-medium text-slate-700">Water Source</Label>
          <Select
            value={formData.Water_Source}
            onValueChange={(val) => updateField("Water_Source", val)}
            disabled={isLoading}
          >
            <SelectTrigger id="irr-source" className="w-full">
              <SelectValue placeholder="Select water source" />
            </SelectTrigger>
            <SelectContent>
              {WATER_SOURCES.map((w) => (
                <SelectItem key={w} value={w}>{w}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="irr-mulch" className="text-sm font-medium text-slate-700">Mulching Used</Label>
          <Select
            value={formData.Mulching_Used}
            onValueChange={(val) => updateField("Mulching_Used", val)}
            disabled={isLoading}
          >
            <SelectTrigger id="irr-mulch" className="w-full">
              <SelectValue placeholder="Select mulching" />
            </SelectTrigger>
            <SelectContent>
              {MULCHING_OPTIONS.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Field Area & Previous Irrigation */}
        <div className="space-y-2">
          <Label htmlFor="irr-area" className="text-sm font-medium text-slate-700">Field Area (hectares)</Label>
          <Input
            id="irr-area"
            type="number"
            min="0.1"
            max="100"
            step="0.1"
            value={formData.Field_Area_hectare}
            onChange={(e) => updateField("Field_Area_hectare", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 2.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="irr-prev" className="text-sm font-medium text-slate-700">Previous Irrigation (mm)</Label>
          <Input
            id="irr-prev"
            type="number"
            min="0"
            max="200"
            step="1"
            value={formData.Previous_Irrigation_mm}
            onChange={(e) => updateField("Previous_Irrigation_mm", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 20"
          />
        </div>

        {/* EC & Organic Carbon */}
        <div className="space-y-2">
          <Label htmlFor="irr-carbon" className="text-sm font-medium text-slate-700">Organic Carbon (%)</Label>
          <Input
            id="irr-carbon"
            type="number"
            min="0"
            max="5"
            step="0.05"
            value={formData.Organic_Carbon}
            onChange={(e) => updateField("Organic_Carbon", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 0.6"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="irr-ec" className="text-sm font-medium text-slate-700">Electrical Cond. (dS/m)</Label>
          <Input
            id="irr-ec"
            type="number"
            min="0"
            max="15"
            step="0.1"
            value={formData.Electrical_Conductivity}
            onChange={(e) => updateField("Electrical_Conductivity", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 1.5"
          />
        </div>

        {/* Wind Speed */}
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="irr-wind" className="text-sm font-medium text-slate-700">Wind Speed (km/h)</Label>
          <Input
            id="irr-wind"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={formData.Wind_Speed_kmh}
            onChange={(e) => updateField("Wind_Speed_kmh", parseFloat(e.target.value) || "")}
            disabled={isLoading}
            placeholder="e.g. 12.0"
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
            Assessing Irrigation Requirement with R Ranger Model...
          </>
        ) : (
          <>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Calculate Irrigation Requirement
          </>
        )}
      </Button>
    </form>
  )
}

export default IrrigationInputForm
