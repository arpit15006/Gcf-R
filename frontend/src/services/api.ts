import type {
  DiseaseRiskRequest,
  DiseaseRiskResponse,
  HealthResponse,
} from "@/types"

/**
 * Central API Service
 * Configurable via VITE_API_URL environment variable.
 * Fallbacks to Vite proxy path '/api' in local dev.
 */
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "/api"
).replace(/\/$/, "")

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options?.headers,
        },
        ...options,
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        const errorMessage =
          data?.error ||
          `Request failed with status ${response.status} (${response.statusText})`
        throw new Error(errorMessage)
      }

      return data as T
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle common network failure scenarios cleanly
        if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
          throw new Error(
            "Backend server is currently unreachable. Please verify the Flask API is running."
          )
        }
        throw error
      }
      throw new Error("An unexpected network error occurred.")
    }
  }

  /**
   * Check backend health status
   */
  async checkHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health")
  }

  /**
   * Submit Disease Risk Prediction request to backend R model inference endpoint
   */
  async predictDiseaseRisk(payload: DiseaseRiskRequest): Promise<DiseaseRiskResponse> {
    return this.request<DiseaseRiskResponse>("/models/disease-risk/predict", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
export default api
