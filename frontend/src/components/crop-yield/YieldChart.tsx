import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import { BarChart3, PieChart, Layers } from 'lucide-react'
import { CropYieldInputs } from './YieldInputForm'
import { PredictionData } from './YieldPredictionResult'

interface YieldChartProps {
  inputs: CropYieldInputs
  prediction: PredictionData | null
}

export const YieldChart: React.FC<YieldChartProps> = ({ inputs, prediction }) => {
  // Normalized features for comparison chart (percent of max dataset range)
  const normalizedFeatureData = [
    { name: 'Rainfall', value: inputs.rainfall, optimal: 1200, unit: 'mm', max: 1300 },
    { name: 'Fertilizer', value: inputs.fertilizer, optimal: 75, unit: 'kg/acre', max: 80 },
    { name: 'Temperature', value: inputs.temperature, optimal: 28, unit: '°C', max: 45 },
    { name: 'Nitrogen (N)', value: inputs.nitrogen, optimal: 80, unit: 'kg/ha', max: 110 },
    { name: 'Phosphorus (P)', value: inputs.phosphorus, optimal: 25, unit: 'kg/ha', max: 45 },
    { name: 'Potassium (K)', value: inputs.potassium, optimal: 20, unit: 'kg/ha', max: 25 },
  ]

  // Soil N-P-K distribution
  const npkData = [
    { name: 'Nitrogen (N)', value: inputs.nitrogen, color: '#10b981' },
    { name: 'Phosphorus (P)', value: inputs.phosphorus, color: '#06b6d4' },
    { name: 'Potassium (K)', value: inputs.potassium, color: '#8b5cf6' },
  ]

  // Dataset Yield Comparison
  const currentPredicted = prediction ? prediction.predicted_yield : 9.05
  const yieldComparisonData = [
    { label: 'Min (Dataset)', yield: 5.5, fill: '#64748b' },
    { label: 'Avg (Dataset)', yield: 9.05, fill: '#0ea5e9' },
    { label: 'Current Model', yield: currentPredicted, fill: '#10b981' },
    { label: 'Max (Dataset)', yield: 12.0, fill: '#f59e0b' },
  ]

  return (
    <Card className="glass-panel glass-panel-hover border-emerald-900/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-100">Agricultural Data Visualizations</CardTitle>
              <CardDescription>Input feature profiles, soil nutrients, and yield benchmarks</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="flex gap-2 p-1 bg-slate-950/80 rounded-lg border border-slate-800 mb-6">
            <TabsTrigger
              value="comparison"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" /> Feature vs Target Profile
            </TabsTrigger>
            <TabsTrigger
              value="yield_benchmarks"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" /> Yield Distribution Benchmark
            </TabsTrigger>
            <TabsTrigger
              value="npk"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-slate-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all cursor-pointer"
            >
              <PieChart className="w-3.5 h-3.5" /> N-P-K Nutrient Profile
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Feature comparison */}
          <TabsContent value="comparison" className="space-y-4">
            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={normalizedFeatureData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    formatter={(val: any, name: any, item: any) => [`${val} ${item.payload.unit}`, name === 'value' ? 'Selected Input' : 'Optimal Target']}
                  />
                  <Bar dataKey="value" name="Selected Input" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="optimal" name="Optimal Target" fill="#334155" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Green bars represent current user input values vs dark slate optimal baseline targets.
            </p>
          </TabsContent>

          {/* Tab 2: Yield Benchmark */}
          <TabsContent value="yield_benchmarks" className="space-y-4">
            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldComparisonData} margin={{ top: 20, right: 20, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} unit=" Q/acre" domain={[0, 14]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    formatter={(val: any) => [`${val} Q/acre`, 'Yield']}
                  />
                  <ReferenceLine y={9.05} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: 'Dataset Mean (9.05 Q/acre)', fill: '#38bdf8', fontSize: 11 }} />
                  <Bar dataKey="yield" radius={[6, 6, 0, 0]} barSize={40}>
                    {yieldComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Comparison of predicted crop yield against historical dataset minimum, mean, and maximum limits.
            </p>
          </TabsContent>

          {/* Tab 3: NPK breakdown */}
          <TabsContent value="npk" className="space-y-4">
            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npkData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} unit=" kg/ha" />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    formatter={(val: any) => [`${val} kg/ha`, 'Nutrient Value']}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                    {npkData.map((entry, index) => (
                      <Cell key={`cell-npk-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Nitrogen ({inputs.nitrogen} kg/ha)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-500" /> Phosphorus ({inputs.phosphorus} kg/ha)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500" /> Potassium ({inputs.potassium} kg/ha)</span>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
