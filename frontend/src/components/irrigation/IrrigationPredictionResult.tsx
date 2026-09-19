import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, AlertOctagon, Droplets } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PredictionResult {
  irrigation_need: "Low" | "Medium" | "High";
  confidence: number;
  probabilities: {
    Low: number;
    Medium: number;
    High: number;
  };
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

interface LevelConfig {
  badgeClass: string;
  icon: typeof CheckCircle2;
  iconColor: string;
  cardBorder: string;
  recommendationBg: string;
  recommendation: string;
}

const LEVEL_CONFIG: Record<PredictionResult["irrigation_need"], LevelConfig> = {
  Low: {
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    cardBorder: "border-emerald-200 dark:border-emerald-900/50",
    recommendationBg: "bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-200",
    recommendation:
      "Current conditions indicate relatively low irrigation requirement.",
  },
  Medium: {
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    cardBorder: "border-amber-200 dark:border-amber-900/50",
    recommendationBg: "bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-200",
    recommendation:
      "Moderate irrigation requirement. Monitor soil moisture and weather.",
  },
  High: {
    badgeClass: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    icon: AlertOctagon,
    iconColor: "text-rose-500",
    cardBorder: "border-rose-200 dark:border-rose-900/50",
    recommendationBg: "bg-rose-50/70 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-900/60 dark:text-rose-200",
    recommendation:
      "High irrigation requirement. Consider additional irrigation based on field conditions.",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  result: PredictionResult;
}

export default function IrrigationPredictionResult({ result }: Props) {
  const config = LEVEL_CONFIG[result.irrigation_need] || LEVEL_CONFIG.Medium;
  const confidencePct = Math.round(result.confidence * 100);
  const StatusIcon = config.icon;

  return (
    <Card className={`shadow-sm border transition-all duration-300 hover:shadow-md ${config.cardBorder}`}>
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <span>Irrigation Requirement</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Prediction Display */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-2">
          <div className={`p-3 rounded-full bg-muted/50 ${config.iconColor}`}>
            <StatusIcon className="h-10 w-10 animate-in zoom-in-50 duration-300" />
          </div>

          <Badge
            variant="outline"
            className={`text-xl font-bold px-6 py-1.5 tracking-wider shadow-sm ${config.badgeClass}`}
          >
            {result.irrigation_need.toUpperCase()}
          </Badge>

          {/* Confidence Meter */}
          <div className="w-full max-w-xs space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
              <span>Confidence</span>
              <span className="font-bold text-foreground text-sm">{confidencePct}%</span>
            </div>
            <Progress
              value={confidencePct}
              className="h-2 bg-muted"
              indicatorClassName={
                result.irrigation_need === "Low"
                  ? "bg-emerald-500"
                  : result.irrigation_need === "Medium"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }
            />
          </div>
        </div>

        {/* Recommendation Box */}
        <div className={`rounded-lg border p-4 text-sm leading-relaxed transition-colors ${config.recommendationBg}`}>
          <div className="font-medium mb-1 text-xs uppercase tracking-wider opacity-80">
            Agronomic Recommendation
          </div>
          {config.recommendation}
        </div>
      </CardContent>
    </Card>
  );
}
