import { CheckCircle2, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export interface PredictionResultData {
  success: boolean
  recommended_crop: string
  confidence: number
  confidence_percentage: number
  top_alternatives?: { crop: string; confidence: number }[]
  inputs?: {
    N: number
    P: number
    K: number
    temperature: number
    humidity: number
    ph: number
    rainfall: number
  }
}

interface CropPredictionResultProps {
  result: PredictionResultData | null
  emptyMessage?: string
}

const CROP_METADATA: Record<string, { icon: string; category: string; summary: string }> = {
  rice: { icon: "🌾", category: "Cereal Grain", summary: "Thrives in high rainfall (>200mm), humid tropical climates with clayey or loamy soils." },
  maize: { icon: "🌽", category: "Cereal Crop", summary: "Requires moderate rainfall (60-100mm), warm temperatures, and well-drained fertile loam." },
  chickpea: { icon: "🫘", category: "Legume Pulse", summary: "Drought-tolerant crop requiring low humidity and well-drained neutral-to-alkaline soil." },
  kidneybeans: { icon: "🫘", category: "Legume Pulse", summary: "Requires moderate temperatures (15-25°C) and rich organic matter soil." },
  pigeonpeas: { icon: "🌱", category: "Pulse Crop", summary: "Deep-rooted leguminous crop ideal for semi-arid tropics with warm soil." },
  mothbeans: { icon: "🌿", category: "Arid Pulse", summary: "Highly drought-resistant legume suitable for sandy, low-nutrient soils." },
  mungbean: { icon: "🌱", category: "Pulse Crop", summary: "Short-duration crop suited for warm humid climates and fertile loams." },
  blackgram: { icon: "🫘", category: "Pulse Crop", summary: "Requires warm weather (25-35°C) and moderate rainfall with balanced NPK." },
  lentil: { icon: "🫘", category: "Cool Pulse", summary: "Thrives in cool climates with light to medium textured well-drained soils." },
  pomegranate: { icon: "🍎", category: "Horticulture Fruit", summary: "Prefers semi-arid, dry climates with high potassium and sunny days." },
  banana: { icon: "🍌", category: "Fruit Crop", summary: "Requires high moisture, high nitrogen, high potassium, and rich soil." },
  mango: { icon: "🥭", category: "Tropical Fruit", summary: "Thrives in warm tropical regions with deep, well-drained alluvial soil." },
  grapes: { icon: "🍇", category: "Horticulture Fruit", summary: "Requires high potassium soil (K > 200), dry weather during fruit ripening." },
  watermelon: { icon: "🍉", category: "Cucurbit Fruit", summary: "Prefers warm dry climates, sandy loam soils, and high sunlight exposure." },
  muskmelon: { icon: "🍈", category: "Cucurbit Fruit", summary: "Requires high temperature, low humidity during maturity, and sandy soil." },
  apple: { icon: "🍎", category: "Temperate Fruit", summary: "Thrives in cool temperate zones with high potassium and loamy soils." },
  orange: { icon: "🍊", category: "Citrus Fruit", summary: "Requires well-drained citrus soil, mild temperatures, and medium rainfall." },
  papaya: { icon: "🥭", category: "Tropical Fruit", summary: "Fast-growing fruit tree needing frost-free warm weather and moist soil." },
  coconut: { icon: "🥥", category: "Plantation Crop", summary: "Requires coastal tropical climate, high humidity (>80%), and sandy loams." },
  cotton: { icon: "☁️", category: "Fiber Cash Crop", summary: "Requires warm temperatures, high nitrogen, and deep black cotton soil." },
  jute: { icon: "🧵", category: "Fiber Crop", summary: "Thrives in warm humid climates with heavy rainfall (>150mm) and alluvial soil." },
  coffee: { icon: "☕", category: "Plantation Beverage", summary: "Requires shaded tropical highlands, rich acidic-to-neutral soil, and rainfall." }
}

export function CropPredictionResult({ result, emptyMessage }: CropPredictionResultProps) {
  if (!result) {
    return (
      <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 mb-3 border border-emerald-100">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            Awaiting Soil &amp; Climate Diagnostics
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            {emptyMessage || "Fill in soil nutrients and weather variables and click 'Recommend Suitable Crop' to run inference."}
          </p>
        </CardContent>
      </Card>
    )
  }

  const cropKey = result.recommended_crop.toLowerCase().trim()
  const meta = CROP_METADATA[cropKey] || {
    icon: "🌱",
    category: "Agricultural Crop",
    summary: "Suitably matched to input NPK and environmental characteristics."
  }
  const confidencePercent = Math.round(result.confidence_percentage || result.confidence * 100)

  return (
    <Card className="border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm uppercase tracking-wider font-semibold text-emerald-400">
            Inference Report
          </h3>
          <p className="text-lg font-bold text-white">
            Crop Recommendation
          </p>
        </div>
        <Badge variant="default" className="bg-emerald-600 text-white px-3 py-1 font-bold">
          OPTIMAL MATCH
        </Badge>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Core Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Recommended Crop
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5 capitalize">
              <span className="text-2xl">{meta.icon}</span>
              <span>{result.recommended_crop}</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Crop Category
            </div>
            <div className="text-sm font-bold text-slate-800 mt-2">
              {meta.category}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase font-medium text-slate-500">
              Model Confidence
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {confidencePercent}%
            </div>
          </div>
        </div>

        {/* Agronomic Summary */}
        <div className="rounded-lg bg-emerald-50/70 border border-emerald-200 p-4 text-xs text-emerald-950 leading-relaxed">
          <div className="font-semibold text-emerald-900 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Agronomic Assessment
          </div>
          {meta.summary}
        </div>

        {/* Alternatives / Competitors */}
        {result.top_alternatives && result.top_alternatives.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Alternative Feasible Candidates
            </div>
            <div className="grid grid-cols-3 gap-2">
              {result.top_alternatives.map((alt) => (
                <div
                  key={alt.crop}
                  className="p-2.5 rounded border text-xs bg-white border-slate-200 text-slate-600"
                >
                  <div className="truncate capitalize font-semibold text-slate-800">{alt.crop}</div>
                  <div className="text-sm font-bold mt-0.5">{Math.round(alt.confidence * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Submitted Parameters Summary */}
        {result.inputs && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Field Conditions Recorded
              </h4>
              <span className="text-xs text-slate-500">
                Input Feature Snapshot
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">N-P-K</span>
                <span className="font-semibold text-slate-800">{result.inputs.N} - {result.inputs.P} - {result.inputs.K}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Temperature</span>
                <span className="font-semibold text-slate-800">{result.inputs.temperature} °C</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Humidity</span>
                <span className="font-semibold text-slate-800">{result.inputs.humidity} %</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Rainfall</span>
                <span className="font-semibold text-slate-800">{result.inputs.rainfall} mm</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
