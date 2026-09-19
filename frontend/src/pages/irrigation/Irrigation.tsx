import { useState, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import IrrigationInputForm, {
  INITIAL_FORM_DATA,
  type IrrigationFormData,
} from "@/components/irrigation/IrrigationInputForm";
import IrrigationPredictionResult, {
  type PredictionResult,
} from "@/components/irrigation/IrrigationPredictionResult";
import IrrigationChart from "@/components/irrigation/IrrigationChart";
import { Droplets, Cpu, AlertCircle, Activity } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Status = "idle" | "loading" | "success" | "error";

const API_URL = "/api/models/irrigation/predict";

// Validate that all 19 fields are filled
function validateForm(data: IrrigationFormData): string | null {
  const requiredSelects: (keyof IrrigationFormData)[] = [
    "Soil_Type",
    "Crop_Type",
    "Crop_Growth_Stage",
    "Season",
    "Irrigation_Type",
    "Water_Source",
    "Mulching_Used",
    "Region",
  ];
  for (const field of requiredSelects) {
    if (!data[field]) {
      return `Please select a value for ${field.replace(/_/g, " ")}.`;
    }
  }

  const requiredNumerics: (keyof IrrigationFormData)[] = [
    "Soil_pH",
    "Soil_Moisture",
    "Organic_Carbon",
    "Electrical_Conductivity",
    "Temperature_C",
    "Humidity",
    "Rainfall_mm",
    "Sunlight_Hours",
    "Wind_Speed_kmh",
    "Field_Area_hectare",
    "Previous_Irrigation_mm",
  ];
  for (const field of requiredNumerics) {
    if (data[field] === "" || data[field] === undefined) {
      return `Please enter a value for ${field.replace(/_/g, " ")}.`;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function Irrigation() {
  const [formData, setFormData] = useState<IrrigationFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string>("");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    // Client-side validation
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
          body.details?.join("; ") ||
          body.error ||
          `Server error (${response.status})`;
        throw new Error(msg);
      }

      const prediction: PredictionResult = await response.json();
      setResult(prediction);
      setStatus("success");

      // Smooth scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-background to-slate-50/50 dark:from-slate-950 dark:via-background dark:to-slate-950/50">
      <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6 space-y-8">
        {/* Header Hero */}
        <div className="space-y-3 border-b pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 flex items-center gap-1.5 py-1 px-2.5">
              <Cpu className="h-3.5 w-3.5" />
              R Machine Learning
            </Badge>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 py-1 px-2.5">
              <Activity className="h-3.5 w-3.5" />
              Ranger Random Forest
            </Badge>
            <Badge variant="secondary" className="py-1 px-2.5 text-xs">
              Person 5
            </Badge>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Droplets className="h-6 w-6" />
                </div>
                <span>Irrigation Requirement Prediction</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Analyze 19 soil, weather, crop, and farm characteristics to classify field irrigation need into{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Low</span>,{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">Medium</span>, or{" "}
                <span className="font-semibold text-rose-600 dark:text-rose-400">High</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Input form */}
        <IrrigationInputForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          isLoading={status === "loading"}
        />

        {/* Error alert */}
        {status === "error" && error && (
          <Alert variant="destructive" className="border-red-300 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200 shadow-xs">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertTitle className="font-semibold">Prediction Failed</AlertTitle>
            <AlertDescription className="text-sm mt-1">{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {status === "success" && result && (
          <div ref={resultRef} className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>Model Output &amp; Analysis</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IrrigationPredictionResult result={result} />
              <IrrigationChart result={result} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
