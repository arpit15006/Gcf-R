import React from 'react';
import { 
  FileCode2, 
  Cpu, 
  Database, 
  Binary, 
  Terminal, 
  Server,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CropModelInfo: React.FC = () => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
            <Cpu className="w-5 h-5" />
            R ML Model Architecture & Pipeline Specs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Technical documentation for the R classification engine & Flask REST API integration.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/80 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 99.09% Test Accuracy
          </span>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <FileCode2 className="w-4 h-4 text-blue-400" /> Language & Engine
          </div>
          <div className="text-base font-bold text-slate-100">R 4.6.1 + Rscript</div>
          <div className="text-[11px] text-slate-500 mt-1">Modular preprocess, train, & predict scripts</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <Binary className="w-4 h-4 text-emerald-400" /> ML Classifier
          </div>
          <div className="text-base font-bold text-slate-100">rpart Decision Tree</div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-class probability estimator</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <Database className="w-4 h-4 text-purple-400" /> Dataset Scope
          </div>
          <div className="text-base font-bold text-slate-100">2,200 Observations</div>
          <div className="text-[11px] text-slate-500 mt-1">22 distinct crop classification targets</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <Server className="w-4 h-4 text-amber-400" /> REST API Route
          </div>
          <div className="text-base font-bold text-slate-100">POST /predict</div>
          <div className="text-[11px] text-slate-500 mt-1">Flask subprocess execution bridge</div>
        </div>
      </div>

      {/* Workflow Architecture Diagram */}
      <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-cyan-400" />
          End-to-End System Integration Flow
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center justify-center">
            <span className="font-bold text-emerald-400 mb-1">React UI</span>
            <span className="text-[10px] text-slate-400">CropInputForm</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center justify-center">
            <span className="font-bold text-amber-400 mb-1">Flask REST API</span>
            <span className="text-[10px] text-slate-400">crop_recommendation.py</span>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center justify-center">
            <span className="font-bold text-cyan-400 mb-1">Rscript Predict</span>
            <span className="text-[10px] text-slate-400">crop_model.rds</span>
          </div>
        </div>
      </div>

      {/* Model Retraining CLI Command */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-400" />
            CLI Model Training Command
          </span>
          <span className="text-[11px] text-slate-500">Run in repository root</span>
        </div>
        <pre className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
          Rscript models/crop_recommendation/R/train.R
        </pre>
      </div>
    </div>
  );
};
