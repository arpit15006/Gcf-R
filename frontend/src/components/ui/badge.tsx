import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-emerald-600 text-white shadow-xs",
    secondary: "border-transparent bg-emerald-100 text-emerald-800",
    destructive: "border-transparent bg-rose-100 text-rose-800",
    outline: "text-slate-700 border-slate-200",
    success: "border-transparent bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "border-transparent bg-amber-100 text-amber-800 border-amber-200"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
