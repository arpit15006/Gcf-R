import { ShieldCheck, AlertTriangle, AlertOctagon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { RiskLevel } from "@/types"

interface RiskIndicatorProps {
  level: RiskLevel
  showIcon?: boolean
  className?: string
}

export function RiskIndicator({ level, showIcon = true, className = "" }: RiskIndicatorProps) {
  const configs = {
    LOW: {
      label: "LOW RISK",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      badgeVariant: "success" as const,
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      description: "Low probability of pathogen escalation. Standard monitoring recommended."
    },
    MEDIUM: {
      label: "MEDIUM RISK",
      color: "bg-amber-100 text-amber-800 border-amber-300",
      badgeVariant: "warning" as const,
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      description: "Early infection detected. Immediate localized inspection advised."
    },
    HIGH: {
      label: "HIGH RISK",
      color: "bg-rose-100 text-rose-800 border-rose-300",
      badgeVariant: "destructive" as const,
      icon: AlertOctagon,
      iconColor: "text-rose-600",
      description: "Critical outbreak hazard. Rapid crop protection intervention required."
    }
  }

  const current = configs[level] || configs.LOW
  const Icon = current.icon

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Badge variant={current.badgeVariant} className="px-3 py-1 text-xs font-bold tracking-wider uppercase">
        {showIcon && <Icon className="mr-1.5 h-3.5 w-3.5 inline" />}
        {current.label}
      </Badge>
    </div>
  )
}
