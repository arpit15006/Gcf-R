import { useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, User, ShieldAlert, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PlaceholderModelProps {
  title: string
  icon: string
  owner: string
  description: string
}

export function PlaceholderModel({ title, icon, owner, description }: PlaceholderModelProps) {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in duration-150">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto text-4xl p-3 bg-slate-100 rounded-2xl w-fit mb-3">
            {icon}
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Badge variant="outline" className="text-slate-600 bg-slate-50 border-slate-200">
              <Clock className="h-3 w-3 mr-1 text-slate-400" /> In Development
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            {title}
          </CardTitle>
          <CardDescription className="text-base text-slate-600 max-w-md mx-auto mt-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-center gap-2 font-semibold text-amber-950 mb-1">
              <ShieldAlert className="h-4 w-4 text-amber-700" />
              Team Ownership Notice
            </div>
            This module is assigned to <span className="font-bold">{owner}</span> and will be integrated independently according to team architectural guidelines. Shared services and layouts are established by Person 1 &amp; Person 4.
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 font-medium block">Assigned Owner</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <User className="h-3.5 w-3.5 text-slate-500" /> {owner}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Integration State</span>
              <span className="font-semibold text-amber-700 block mt-0.5">
                Module Pending Merge
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Button
            variant="default"
            onClick={() => navigate("/disease-risk")}
            className="w-full sm:w-auto"
          >
            <span>Open Active Disease Risk</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
