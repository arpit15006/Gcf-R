import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FlaskConical,
  CloudSun,
  Sprout,
  Tractor,
  Droplets,
  RotateCcw,
  Sparkles,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IrrigationFormData {
  Soil_Type: string;
  Soil_pH: number | "";
  Soil_Moisture: number | "";
  Organic_Carbon: number | "";
  Electrical_Conductivity: number | "";
  Temperature_C: number | "";
  Humidity: number | "";
  Rainfall_mm: number | "";
  Sunlight_Hours: number | "";
  Wind_Speed_kmh: number | "";
  Crop_Type: string;
  Crop_Growth_Stage: string;
  Season: string;
  Irrigation_Type: string;
  Water_Source: string;
  Field_Area_hectare: number | "";
  Mulching_Used: string;
  Previous_Irrigation_mm: number | "";
  Region: string;
}

export const INITIAL_FORM_DATA: IrrigationFormData = {
  Soil_Type: "",
  Soil_pH: "",
  Soil_Moisture: "",
  Organic_Carbon: "",
  Electrical_Conductivity: "",
  Temperature_C: "",
  Humidity: "",
  Rainfall_mm: "",
  Sunlight_Hours: "",
  Wind_Speed_kmh: "",
  Crop_Type: "",
  Crop_Growth_Stage: "",
  Season: "",
  Irrigation_Type: "",
  Water_Source: "",
  Field_Area_hectare: "",
  Mulching_Used: "",
  Previous_Irrigation_mm: "",
  Region: "",
};

export const SAMPLE_FORM_DATA: IrrigationFormData = {
  Soil_Type: "Clay",
  Soil_pH: 6.14,
  Soil_Moisture: 36.48,
  Organic_Carbon: 0.42,
  Electrical_Conductivity: 2.17,
  Temperature_C: 21.9,
  Humidity: 40.0,
  Rainfall_mm: 102.1,
  Sunlight_Hours: 8.0,
  Wind_Speed_kmh: 14.5,
  Crop_Type: "Wheat",
  Crop_Growth_Stage: "Vegetative",
  Season: "Rabi",
  Irrigation_Type: "Sprinkler",
  Water_Source: "River",
  Field_Area_hectare: 2.5,
  Mulching_Used: "No",
  Previous_Irrigation_mm: 20.0,
  Region: "North",
};

// ---------------------------------------------------------------------------
// Dropdown options — from the actual dataset
// ---------------------------------------------------------------------------

const SOIL_TYPES = ["Clay", "Loamy", "Sandy", "Silt"];
const CROP_TYPES = ["Cotton", "Maize", "Potato", "Rice", "Sugarcane", "Wheat"];
const GROWTH_STAGES = ["Flowering", "Harvest", "Sowing", "Vegetative"];
const SEASONS = ["Kharif", "Rabi", "Zaid"];
const IRRIGATION_TYPES = ["Canal", "Drip", "Rainfed", "Sprinkler"];
const WATER_SOURCES = ["Groundwater", "Rainwater", "Reservoir", "River"];
const MULCHING_OPTIONS = ["Yes", "No"];
const REGIONS = ["Central", "East", "North", "South", "West"];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  formData: IrrigationFormData;
  onChange: (data: IrrigationFormData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function IrrigationInputForm({
  formData,
  onChange,
  onSubmit,
  isLoading,
}: Props) {
  const updateField = <K extends keyof IrrigationFormData>(
    key: K,
    value: IrrigationFormData[K]
  ) => {
    onChange({ ...formData, [key]: value });
  };

  const handleNumericChange = (
    key: keyof IrrigationFormData,
    raw: string
  ) => {
    if (raw === "") {
      updateField(key, "" as never);
    } else {
      const num = parseFloat(raw);
      if (!isNaN(num)) updateField(key, num as never);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Reusable select renderer
  const renderSelect = (
    label: string,
    field: keyof IrrigationFormData,
    options: string[]
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={field} className="text-xs font-medium text-foreground/80">
        {label}
      </Label>
      <Select
        value={formData[field] as string}
        onValueChange={(v) => updateField(field, v as never)}
      >
        <SelectTrigger id={field} className="w-full bg-background transition-colors hover:border-primary/50 focus:border-primary">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Reusable numeric input renderer
  const renderNumericInput = (
    label: string,
    field: keyof IrrigationFormData,
    placeholder: string,
    step = "any",
    unit?: string
  ) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <Label htmlFor={field} className="text-xs font-medium text-foreground/80">
          {label}
        </Label>
        {unit && <span className="text-[11px] text-muted-foreground font-mono">{unit}</span>}
      </div>
      <Input
        id={field}
        type="number"
        step={step}
        placeholder={placeholder}
        value={formData[field] === "" ? "" : formData[field]}
        onChange={(e) => handleNumericChange(field, e.target.value)}
        className="w-full bg-background transition-colors hover:border-primary/50 focus:border-primary"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Input Parameters (19 Features)
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(SAMPLE_FORM_DATA)}
            className="h-8 text-xs font-medium flex items-center gap-1.5 border-primary/20 hover:bg-primary/5 text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Fill Sample Data
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(INITIAL_FORM_DATA)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
      </div>

      {/* ── Soil ─────────────────────────────────────────── */}
      <Card className="shadow-xs border transition-shadow hover:shadow-sm">
        <CardHeader className="py-3 px-5 border-b border-border/50 bg-muted/20">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FlaskConical className="h-4 w-4" />
            </div>
            <span>Soil Properties</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderSelect("Soil Type", "Soil_Type", SOIL_TYPES)}
          {renderNumericInput("Soil pH", "Soil_pH", "e.g. 6.5", "0.01", "pH scale")}
          {renderNumericInput("Soil Moisture", "Soil_Moisture", "e.g. 35.0", "0.01", "%")}
          {renderNumericInput("Organic Carbon", "Organic_Carbon", "e.g. 0.5", "0.01", "%")}
          {renderNumericInput(
            "Electrical Conductivity",
            "Electrical_Conductivity",
            "e.g. 1.2",
            "0.01",
            "dS/m"
          )}
        </CardContent>
      </Card>

      {/* ── Weather ──────────────────────────────────────── */}
      <Card className="shadow-xs border transition-shadow hover:shadow-sm">
        <CardHeader className="py-3 px-5 border-b border-border/50 bg-muted/20">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <div className="p-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <CloudSun className="h-4 w-4" />
            </div>
            <span>Weather Conditions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderNumericInput("Temperature", "Temperature_C", "e.g. 28.5", "0.1", "°C")}
          {renderNumericInput("Humidity", "Humidity", "e.g. 65.0", "0.1", "%")}
          {renderNumericInput("Rainfall", "Rainfall_mm", "e.g. 12.0", "0.1", "mm")}
          {renderNumericInput("Sunlight Hours", "Sunlight_Hours", "e.g. 8.0", "0.1", "hours/day")}
          {renderNumericInput("Wind Speed", "Wind_Speed_kmh", "e.g. 14.5", "0.1", "km/h")}
        </CardContent>
      </Card>

      {/* ── Crop ────────────────────────────────────────── */}
      <Card className="shadow-xs border transition-shadow hover:shadow-sm">
        <CardHeader className="py-3 px-5 border-b border-border/50 bg-muted/20">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sprout className="h-4 w-4" />
            </div>
            <span>Crop Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderSelect("Crop Type", "Crop_Type", CROP_TYPES)}
          {renderSelect("Growth Stage", "Crop_Growth_Stage", GROWTH_STAGES)}
          {renderSelect("Season", "Season", SEASONS)}
        </CardContent>
      </Card>

      {/* ── Irrigation / Farm ───────────────────────────── */}
      <Card className="shadow-xs border transition-shadow hover:shadow-sm">
        <CardHeader className="py-3 px-5 border-b border-border/50 bg-muted/20">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Tractor className="h-4 w-4" />
            </div>
            <span>Irrigation &amp; Farm Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {renderSelect("Irrigation Type", "Irrigation_Type", IRRIGATION_TYPES)}
          {renderSelect("Water Source", "Water_Source", WATER_SOURCES)}
          {renderNumericInput("Field Area", "Field_Area_hectare", "e.g. 2.5", "0.1", "hectares")}
          {renderSelect("Mulching Used", "Mulching_Used", MULCHING_OPTIONS)}
          {renderNumericInput("Previous Irrigation", "Previous_Irrigation_mm", "e.g. 20.0", "0.1", "mm")}
          {renderSelect("Region", "Region", REGIONS)}
        </CardContent>
      </Card>

      {/* ── Submit ──────────────────────────────────────── */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full text-base py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white font-semibold shadow-md shadow-blue-500/20 transition-all duration-200 cursor-pointer disabled:opacity-60"
        size="lg"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Evaluating Agricultural Model…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Predict Irrigation Need
          </span>
        )}
      </Button>
    </form>
  );
}
