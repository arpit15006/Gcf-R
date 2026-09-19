import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50/80 p-4 text-rose-900 shadow-2xs">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <h4 className="font-semibold text-rose-950">System Notice</h4>
          <p className="mt-0.5 text-rose-800 leading-relaxed">{message}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-rose-300 bg-white text-rose-900 hover:bg-rose-100 shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
