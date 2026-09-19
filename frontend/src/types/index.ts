export type CropType = "Corn" | "Potato" | "Rice" | "Tomato" | "Wheat"

export type LeafColor = "Brown" | "Green" | "Yellow"

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH"

export type DiseaseStatus = "Healthy" | "Mild Infection" | "Severe Infection"

export interface DiseaseRiskRequest {
  crop: CropType
  leaf_color: LeafColor
  leaf_spot_size: number
  humidity: number
  temperature: number
}

export interface FeatureImportanceFactor {
  label: string
  percentage: number
  score: number
}

export interface DiseaseRiskResponse {
  prediction: DiseaseStatus | string
  risk_level: RiskLevel
  probability: number
  probabilities?: Record<string, number>
  feature_importance?: Record<string, FeatureImportanceFactor>
  timestamp?: string
  error?: string
}

export interface ModelCardInfo {
  id: string
  title: string
  icon: string
  description: string
  route: string
  status: "active" | "development"
  badgeText: string
  owner: string
}

export interface HealthResponse {
  status: string
}
