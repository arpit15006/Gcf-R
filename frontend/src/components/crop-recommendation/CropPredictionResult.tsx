import React from 'react';
import { 
  CheckCircle2, 
  Award, 
  Layers, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface PredictionResultData {
  success: boolean;
  recommended_crop: string;
  confidence: number;
  confidence_percentage: number;
  top_alternatives?: { crop: string; confidence: number }[];
  inputs?: {
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
  };
}

interface CropPredictionResultProps {
  result: PredictionResultData;
  onReset?: () => void;
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
};

export const CropPredictionResult: React.FC<CropPredictionResultProps> = ({ result, onReset }) => {
  const cropKey = result.recommended_crop.toLowerCase().trim();
  const meta = CROP_METADATA[cropKey] || { 
    icon: "🌱", 
    category: "Agricultural Crop", 
    summary: "Optimal crop choice matching provided soil chemistry and environmental metrics." 
  };

  const confidencePct = Math.min(100, Math.max(0, result.confidence_percentage || (result.confidence * 100)));

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 relative overflow-hidden animate-fadeIn">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          R ML Inference Completed
        </span>
        <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          rpart Model Decision Engine
        </span>
      </div>

      {/* Main Recommended Crop Showcase */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Crop Icon & Name */}
        <div className="md:col-span-2 flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-4xl shadow-inner shrink-0">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                {meta.category}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white capitalize mt-1 tracking-tight">
              {result.recommended_crop}
            </h1>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {meta.summary}
            </p>
          </div>
        </div>

        {/* Confidence Meter Box */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
          <span className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Model Confidence
          </span>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            {confidencePct.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${confidencePct}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1">
            Calculated via class probability vector
          </span>
        </div>
      </div>

      {/* Input Metrics Summary Pills */}
      {result.inputs && (
        <div className="my-5 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Evaluated Input Profile
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500">Nitrogen</span>
              <span className="font-bold text-emerald-300">{result.inputs.N} kg/ha</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500">Phosphorus</span>
              <span className="font-bold text-emerald-300">{result.inputs.P} kg/ha</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500">Potassium</span>
              <span className="font-bold text-emerald-300">{result.inputs.K} kg/ha</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500">Temp</span>
              <span className="font-bold text-amber-300">{result.inputs.temperature}°C</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500">Humidity</span>
              <span className="font-bold text-cyan-300">{result.inputs.humidity}%</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500">pH</span>
              <span className="font-bold text-purple-300">{result.inputs.ph}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="block text-[10px] text-slate-500">Rainfall</span>
              <span className="font-bold text-indigo-300">{result.inputs.rainfall} mm</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Alternative Recommendations */}
      {result.top_alternatives && result.top_alternatives.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Alternative Suitable Crops
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.top_alternatives.map((alt, idx) => {
              const altMeta = CROP_METADATA[alt.crop.toLowerCase()] || { icon: "🌱" };
              const altConf = (alt.confidence * 100).toFixed(1);
              return (
                <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{altMeta.icon}</span>
                    <span className="text-sm font-semibold capitalize text-slate-200">{alt.crop}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{altConf}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer */}
      {onReset && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <span>Run Another Prediction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
