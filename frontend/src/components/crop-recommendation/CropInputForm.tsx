import React, { useState } from 'react';
import { 
  Sprout, 
  FlaskConical, 
  Thermometer, 
  Droplets, 
  TestTube, 
  CloudRain, 
  RotateCcw, 
  Sparkles, 
  Info 
} from 'lucide-react';

export interface CropInputValues {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

interface CropInputFormProps {
  onSubmit: (values: CropInputValues) => void;
  isLoading: boolean;
}

const DEFAULT_VALUES: CropInputValues = {
  N: 90,
  P: 42,
  K: 43,
  temperature: 20.87,
  humidity: 82.0,
  ph: 6.5,
  rainfall: 202.93,
};

const PRESETS: { name: string; icon: string; values: CropInputValues }[] = [
  {
    name: "Monsoon Rice",
    icon: "🌾",
    values: { N: 90, P: 42, K: 43, temperature: 20.87, humidity: 82.0, ph: 6.5, rainfall: 202.93 }
  },
  {
    name: "Dryland Maize",
    icon: "🌽",
    values: { N: 78, P: 48, K: 20, temperature: 22.3, humidity: 65.0, ph: 6.2, rainfall: 85.5 }
  },
  {
    name: "High Potassium Grapes",
    icon: "🍇",
    values: { N: 23, P: 132, K: 202, temperature: 23.8, humidity: 81.5, ph: 6.0, rainfall: 69.8 }
  },
  {
    name: "Semi-Arid Chickpea",
    icon: "🫘",
    values: { N: 40, P: 68, K: 79, temperature: 18.2, humidity: 16.5, ph: 7.4, rainfall: 78.4 }
  }
];

export const CropInputForm: React.FC<CropInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formValues, setFormValues] = useState<CropInputValues>(DEFAULT_VALUES);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleChange = (field: keyof CropInputValues, value: string) => {
    const numVal = parseFloat(value);
    setFormValues(prev => ({
      ...prev,
      [field]: isNaN(numVal) ? 0 : numVal
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  const handleReset = () => {
    setFormValues(DEFAULT_VALUES);
  };

  const applyPreset = (presetValues: CropInputValues) => {
    setFormValues(presetValues);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100">
      {/* Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
            <Sprout className="w-5 h-5" />
            Soil & Climatic Input Features
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter N-P-K soil parameters along with regional climatic metrics.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset.values)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-600/50 border border-slate-700 transition-all flex items-center gap-1"
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Soil NPK Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            Soil Macro-Nutrients (kg/ha)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nitrogen */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 focus-within:border-emerald-500 transition-all relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Nitrogen (N)</label>
                <button
                  type="button"
                  onMouseEnter={() => setActiveTooltip('N')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              {activeTooltip === 'N' && (
                <div className="absolute top-8 right-2 z-10 w-48 p-2 bg-slate-800 text-[11px] text-slate-200 rounded-md shadow-lg border border-slate-700">
                  Promotes leaf & vegetative growth. Range: 0 - 140 kg/ha.
                </div>
              )}
              <input
                type="number"
                step="any"
                min="0"
                max="200"
                required
                value={formValues.N}
                onChange={(e) => handleChange('N', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Phosphorus */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 focus-within:border-emerald-500 transition-all relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Phosphorus (P)</label>
                <button
                  type="button"
                  onMouseEnter={() => setActiveTooltip('P')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              {activeTooltip === 'P' && (
                <div className="absolute top-8 right-2 z-10 w-48 p-2 bg-slate-800 text-[11px] text-slate-200 rounded-md shadow-lg border border-slate-700">
                  Stimulates root development & seed formation. Range: 5 - 145 kg/ha.
                </div>
              )}
              <input
                type="number"
                step="any"
                min="0"
                max="200"
                required
                value={formValues.P}
                onChange={(e) => handleChange('P', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Potassium */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 focus-within:border-emerald-500 transition-all relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">Potassium (K)</label>
                <button
                  type="button"
                  onMouseEnter={() => setActiveTooltip('K')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              {activeTooltip === 'K' && (
                <div className="absolute top-8 right-2 z-10 w-48 p-2 bg-slate-800 text-[11px] text-slate-200 rounded-md shadow-lg border border-slate-700">
                  Enhances drought tolerance & crop quality. Range: 5 - 205 kg/ha.
                </div>
              )}
              <input
                type="number"
                step="any"
                min="0"
                max="250"
                required
                value={formValues.K}
                onChange={(e) => handleChange('K', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Environmental & Soil pH Section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            Climatic & Soil pH Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Temperature */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 focus-within:border-cyan-500 transition-all">
              <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Temp (°C)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                max="60"
                required
                value={formValues.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Humidity */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 focus-within:border-cyan-500 transition-all">
              <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                Humidity (%)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                max="100"
                required
                value={formValues.humidity}
                onChange={(e) => handleChange('humidity', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* pH */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 focus-within:border-cyan-500 transition-all">
              <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <TestTube className="w-3.5 h-3.5 text-purple-400" />
                Soil pH
              </label>
              <input
                type="number"
                step="any"
                min="1"
                max="14"
                required
                value={formValues.ph}
                onChange={(e) => handleChange('ph', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-purple-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Rainfall */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 focus-within:border-cyan-500 transition-all">
              <label className="text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
                Rainfall (mm)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                max="500"
                required
                value={formValues.rainfall}
                onChange={(e) => handleChange('rainfall', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Running R ML Model...</span>
              </>
            ) : (
              <>
                <Sprout className="w-4 h-4" />
                <span>Predict Recommended Crop</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
