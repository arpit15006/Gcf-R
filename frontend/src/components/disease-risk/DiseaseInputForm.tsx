import React, { useState } from "react"
import { Loader2, Sparkles, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Presets:
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyPreset("Corn", "Brown", 3.8, 69.5, 30.7)}
          className="h-7 text-xs px-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
        >
          Corn (Warm &amp; Humid)
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyPreset("Potato", "Green", 0.24, 38.6, 24.5)}
          className="h-7 text-xs px-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
        >
          Potato (Dry Canopy)
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyPreset("Tomato", "Yellow", 9.4, 63.6, 28.9)}
          className="h-7 text-xs px-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border-slate-200"
        >
          Tomato (Severe Lesions)
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Crop Selection */}
        <div className="space-y-2">
          <Label htmlFor="crop-select" className="text-sm font-medium text-slate-700">
            Crop Species <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={crop}
            onValueChange={(val) => setCrop(val as CropType)}
            disabled={isLoading}
          >
            <SelectTrigger id="crop-select" className="w-full">
              <SelectValue placeholder="Select crop species" />
            </SelectTrigger>
            <SelectContent>
              {CROPS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Leaf Color */}
        <div className="space-y-2">
          <Label htmlFor="leaf-color-select" className="text-sm font-medium text-slate-700">
            Leaf Discoloration <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={leafColor}
            onValueChange={(val) => setLeafColor(val as LeafColor)}
            disabled={isLoading}
          >
            <SelectTrigger id="leaf-color-select" className="w-full">
              <SelectValue placeholder="Select discoloration" />
            </SelectTrigger>
            <SelectContent>
              {LEAF_COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Leaf Spot Size */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="leaf-spot-input" className="text-sm font-medium text-slate-700">
              Leaf Spot Size
            </Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {leafSpotSize} cm
            </span>
          </div>
          <Input
            id="leaf-spot-input"
            type="number"
            min="0.01"
            max="10.0"
            step="0.01"
            value={leafSpotSize}
            onChange={(e) => setLeafSpotSize(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={0.01}
            max={10.0}
            step={0.1}
            value={[leafSpotSize]}
            onValueChange={([val]) => setLeafSpotSize(Number(val.toFixed(2)))}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="temp-input" className="text-sm font-medium text-slate-700">
              Canopy Temperature
            </Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {temperature} °C
            </span>
          </div>
          <Input
            id="temp-input"
            type="number"
            min="15.0"
            max="35.0"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={15.0}
            max={35.0}
            step={0.5}
            value={[temperature]}
            onValueChange={([val]) => setTemperature(Number(val.toFixed(1)))}
            disabled={isLoading}
            className="pt-1"
          />
        </div>

        {/* Humidity */}
        <div className="sm:col-span-2 space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="humidity-input" className="text-sm font-medium text-slate-700">
              Relative Humidity
            </Label>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {humidity} %
            </span>
          </div>
          <Input
            id="humidity-input"
            type="number"
            min="30.0"
            max="90.0"
            step="0.1"
            value={humidity}
            onChange={(e) => setHumidity(parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          <Slider
            min={30.0}
            max={90.0}
            step={1.0}
            value={[humidity]}
            onValueChange={([val]) => setHumidity(Number(val.toFixed(1)))}
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
