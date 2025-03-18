"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building } from "lucide-react"

interface DepartmentCardProps {
  rank: number
  collegeName: string
  departmentName: string
  cutoff: number
  isHighlighted?: boolean
}

export default function DepartmentCard({
  rank,
  collegeName,
  departmentName,
  cutoff,
  isHighlighted = false,
}: DepartmentCardProps) {
  // Generate a color based on the rank
  const getGradient = (rank) => {
    const gradients = [
      "from-indigo-500 to-purple-600",
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-emerald-600",
      "from-rose-500 to-orange-600",
    ]
    return gradients[rank - 1] || "from-gray-500 to-gray-600"
  }

  return (
    <Card
      className={`overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 ${
        isHighlighted ? "ring-2 ring-purple-500 ring-offset-2" : ""
      }`}
    >
      <div className={`h-2 bg-gradient-to-r ${getGradient(rank)}`}></div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Rank #{rank}
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 border-0 font-bold">{cutoff.toFixed(1)}</Badge>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <Building className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <h3 className="font-semibold text-gray-800 line-clamp-2">{collegeName}</h3>
        </div>

        <div className="mt-auto">
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-0 font-medium">
            {departmentName}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

