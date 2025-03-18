import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface AnalysisCardProps {
  chanceOfGetting: string
  worthCollege: string
  ocCutoff: number
}

export default function AnalysisCard({ chanceOfGetting, worthCollege, ocCutoff }: AnalysisCardProps) {
  // Calculate a score for visualization (just for UI purposes)
  const chanceScore = chanceOfGetting === "Yes" ? 85 : 35
  const worthScore = worthCollege === "Yes" ? 85 : 45

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Admission Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Chance of Getting Admission</span>
            <Badge className={chanceOfGetting === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
              {chanceOfGetting}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={chanceScore} className="h-2" />
            {chanceOfGetting === "Yes" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Worth College</span>
            <Badge className={worthCollege === "Yes" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
              {worthCollege}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={worthScore} className="h-2" />
            {worthCollege === "Yes" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">OC Cutoff</span>
            <span className="text-lg font-bold text-blue-700">{ocCutoff.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

