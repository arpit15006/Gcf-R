import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import { Dashboard } from "@/pages/Dashboard"
import { DiseaseRisk } from "@/pages/disease-risk/DiseaseRisk"
import { PlaceholderModel } from "@/pages/PlaceholderModel"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Active Disease Risk Module (Person 1 + Person 4) */}
          <Route path="disease-risk" element={<DiseaseRisk />} />

          {/* Navigation destinations for teammate models */}
          <Route
            path="crop-recommendation"
            element={
              <PlaceholderModel
                title="🌱 Crop Recommendation"
                icon="🌱"
                owner="Person 2"
                description="Find the most suitable crop based on soil characteristics and environmental conditions."
              />
            }
          />
          <Route
            path="crop-yield"
            element={
              <PlaceholderModel
                title="📈 Crop Yield Prediction"
                icon="📈"
                owner="Person 3"
                description="Predict expected crop harvest yield based on regional parameters and climate trends."
              />
            }
          />
          <Route
            path="irrigation"
            element={
              <PlaceholderModel
                title="💧 Irrigation Requirement"
                icon="💧"
                owner="Person 5"
                description="Calculate and forecast irrigation water requirements based on soil moisture and climate."
              />
            }
          />
          <Route
            path="weather-risk"
            element={
              <PlaceholderModel
                title="🌦️ Weather Risk"
                icon="🌦️"
                owner="Person 6"
                description="Assess microclimate hazard probabilities including frost, heatwaves, and drought."
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
