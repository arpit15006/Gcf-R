import React, { useState } from 'react';
import { 
  Sprout, 
  Cpu, 
  AlertCircle, 
  Activity, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { CropInputForm, type CropInputValues } from '../../components/crop-recommendation/CropInputForm';
import { CropPredictionResult, type PredictionResultData } from '../../components/crop-recommendation/CropPredictionResult';
import { CropModelInfo } from '../../components/crop-recommendation/CropModelInfo';

export const CropRecommendationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'predictor' | 'model-info'>('predictor');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionResultData | null>(null);

  const handlePredict = async (values: CropInputValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    setPredictionResult(null);

    try {
      const response = await fetch('/api/models/crop-recommendation/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to retrieve recommendation.`);
      }

      setPredictionResult(data);
    } catch (err: any) {
      console.error('Crop Recommendation API Error:', err);
      setErrorMessage(
        err.message || 'Failed to communicate with R ML backend. Please verify backend server status.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                PERSON 2 Module
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> R ML Powered
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Sprout className="w-8 h-8 text-emerald-400" />
              🌱 Crop Recommendation Intelligence
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Analyze soil N-P-K macro-nutrients and local climate factors to determine optimal high-yield crop selection.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
              <span className="block text-[10px] text-slate-500 font-semibold uppercase">Engine</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> R rpart Classifier
              </span>
            </div>
            <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
              <span className="block text-[10px] text-slate-500 font-semibold uppercase">Accuracy</span>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 99.09%
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('predictor')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'predictor'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sprout className="w-4 h-4" />
            Crop Predictor Form
          </button>

          <button
            onClick={() => setActiveTab('model-info')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'model-info'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Model Architecture & Pipeline
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-600/60 p-4 rounded-2xl flex items-start justify-between gap-3 text-rose-200 text-sm shadow-lg animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-300">Prediction Engine Error</h4>
                <p className="text-xs text-rose-200/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-400 hover:text-rose-200 underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Predictor */}
        {activeTab === 'predictor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={predictionResult ? "lg:col-span-6" : "lg:col-span-12"}>
              <CropInputForm onSubmit={handlePredict} isLoading={isLoading} />
            </div>

            {/* Result Column */}
            {predictionResult && (
              <div className="lg:col-span-6">
                <CropPredictionResult result={predictionResult} onReset={handleReset} />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Model Info */}
        {activeTab === 'model-info' && (
          <CropModelInfo />
        )}
      </div>
    </div>
  );
};

export default CropRecommendationPage;
