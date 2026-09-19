import { useNavigate } from "react-router-dom"
import { ArrowRight, Lock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ModelCardInfo } from "@/types"

interface ModelCardProps {
  model: ModelCardInfo
}

export function ModelCard({ model }: ModelCardProps) {
  const navigate = useNavigate()
  const isActive = model.status === "active"

  return (
    <Card className={`flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
      isActive ? "border-emerald-200 bg-linear-to-b from-white to-emerald-50/20" : "bg-white"
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-3xl p-2 rounded-lg bg-slate-100/80 inline-block">
            {model.icon}
          </span>
          <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-emerald-600" : "text-slate-500 bg-slate-50"}>
            {model.badgeText}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold text-slate-900 mt-2">
          {model.title}
        </CardTitle>
        <CardDescription className="text-slate-600 text-sm mt-1 line-clamp-3">
          {model.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-xs text-slate-400 font-medium">
          Owner: <span className="text-slate-600 font-semibold">{model.owner}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant={isActive ? "default" : "outline"}
          className="w-full justify-between"
          onClick={() => navigate(model.route)}
        >
          <span>{isActive ? "Open Model" : "View Status"}</span>
          {isActive ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <Lock className="h-3.5 w-3.5 text-slate-400" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
