import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Dashboard } from "@/pages/Dashboard"
import { DiseaseRisk } from "@/pages/disease-risk/DiseaseRisk"
import { CropRecommendationPage } from "@/pages/crop-recommendation/CropRecommendation"
import { CropYield } from "@/pages/crop-yield/CropYield"
import Irrigation from "@/pages/irrigation/Irrigation"
import { PlaceholderModel } from "@/pages/PlaceholderModel"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Active Model Modules */}
          <Route path="disease-risk" element={<DiseaseRisk />} />
          <Route path="crop-recommendation" element={<CropRecommendationPage />} />
          <Route path="crop-yield" element={<CropYield />} />
          <Route path="irrigation" element={<Irrigation />} />

          {/* Weather Risk (only model currently in development) */}
          <Route
            path="weather-risk"
            element={
              <PlaceholderModel
                title="🌦️ Weather Risk"
                icon="🌦️"
                owner="Person 6"
                description="Assess microclimate hazard probabilities including frost, heatwaves, and unseasonal storms."
              />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
