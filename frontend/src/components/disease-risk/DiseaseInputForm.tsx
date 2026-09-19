import React, { useState } from "react"
import { Loader2, Sparkles, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CropType, LeafColor, DiseaseRiskRequest } from "@/types"

interface DiseaseInputFormProps {
  onSubmit: (formData: DiseaseRiskRequest) => void
  isLoading: boolean
}

const CROPS: CropType[] = ["Corn", "Potato", "Rice", "Tomato", "Wheat"]
const LEAF_COLORS: LeafColor[] = ["Brown", "Green", "Yellow"]

export function DiseaseInputForm({ onSubmit, isLoading }: DiseaseInputFormProps) {
  const [crop, setCrop] = useState<CropType>("Corn")
  const [leafColor, setLeafColor] = useState<LeafColor>("Brown")
  const [leafSpotSize, setLeafSpotSize] = useState<number>(3.8)
  const [humidity, setHumidity] = useState<number>(69.5)
  const [temperature, setTemperature] = useState<number>(30.7)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      crop,
      leaf_color: leafColor,
      leaf_spot_size: Number(leafSpotSize),
      humidity: Number(humidity),
      temperature: Number(temperature),
    })
  }

  // Quick preset loader from actual dataset instances
  const applyPreset = (
    c: CropType,
    col: LeafColor,
    spot: number,
    hum: number,
    temp: number
  ) => {
    setCrop(c)
    setLeafColor(col)
    setLeafSpotSize(spot)
    setHumidity(hum)
    setTemperature(temp)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Field Presets */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Presets:
        </span>
        <button
          type="button"
          onClick={() => applyPreset("Corn", "Brown", 3.8, 69.5, 30.7)}
          className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
        >
          Corn (Warm &amp; Humid)
        </button>
        <button
          type="button"
          onClick={() => applyPreset("Potato", "Green", 0.24, 38.6, 24.5)}
          className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
        >
          Potato (Dry Canopy)
        </button>
        <button
          type="button"
          onClick={() => applyPreset("Tomato", "Yellow", 9.4, 63.6, 28.9)}
          className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
        >
          Tomato (Severe Lesions)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Crop Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Crop Species <span className="text-rose-500">*</span>
          </label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value as CropType)}
            disabled={isLoading}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Leaf Color */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Leaf Discoloration <span className="text-rose-500">*</span>
          </label>
          <select
            value={leafColor}
            onChange={(e) => setLeafColor(e.target.value as LeafColor)}
            disabled={isLoading}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            {LEAF_COLORS.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Leaf Spot Size */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-slate-700">
              Leaf Spot Size
            </label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {leafSpotSize} cm
            </span>
          </div>
          <input
            type="number"
            min="0.01"
            max="10.0"
            step="0.01"
            value={leafSpotSize}
            onChange={(e) => setLeafSpotSize(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="range"
            min="0.01"
            max="10.0"
            step="0.1"
            value={leafSpotSize}
            onChange={(e) => setLeafSpotSize(parseFloat(e.target.value))}
            disabled={isLoading}
            className="w-full mt-2 accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Temperature */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-slate-700">
              Canopy Temperature
            </label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {temperature} °C
            </span>
          </div>
          <input
            type="number"
            min="15.0"
            max="35.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="range"
            min="15.0"
            max="35.0"
            step="0.5"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            disabled={isLoading}
            className="w-full mt-2 accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* Humidity */}
        <div className="sm:col-span-2">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-slate-700">
              Relative Humidity
            </label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {humidity} %
            </span>
          </div>
          <input
            type="number"
            min="30.0"
            max="90.0"
            step="0.1"
            value={humidity}
            onChange={(e) => setHumidity(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
          <input
            type="range"
            min="30.0"
            max="90.0"
            step="1.0"
            value={humidity}
            onChange={(e) => setHumidity(parseFloat(e.target.value))}
            disabled={isLoading}
            className="w-full mt-2 accent-emerald-600 cursor-pointer"
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
            Analyzing Crop Risk with R Model...
          </>
        ) : (
          <>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Calculate Disease Risk
          </>
        )}
      </Button>
    </form>
  )
}
