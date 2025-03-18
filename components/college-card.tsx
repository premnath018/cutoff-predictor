"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { School, Star } from "lucide-react"

interface CollegeCardProps {
  rank: number
  collegeName: string
  departmentName: string
  cutoff: number
  isHighlighted?: boolean
  isTop?: boolean
}

export default function CollegeCard({
  rank,
  collegeName,
  departmentName,
  cutoff,
  isHighlighted = false,
  isTop = false,
}: CollegeCardProps) {
  // Generate a color based on the rank
  const getBadgeColor = (rank) => {
    if (isTop) {
      if (rank === 1) return "bg-amber-100 text-amber-800 border-amber-200"
      if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-200"
      if (rank === 3) return "bg-orange-100 text-orange-800 border-orange-200"
    }
    return "bg-blue-50 text-blue-700 border-blue-200"
  }

  return (
    <Card
      className={`overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 ${
        isHighlighted ? "ring-2 ring-indigo-500 ring-offset-2" : ""
      }`}
    >
      <div
        className={`h-2 ${
          isTop && rank === 1
            ? "bg-gradient-to-r from-amber-400 to-yellow-300"
            : isHighlighted
              ? "bg-gradient-to-r from-indigo-500 to-purple-500"
              : "bg-gradient-to-r from-blue-500 to-indigo-500"
        }`}
      ></div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className={getBadgeColor(rank)}>
            {isTop && rank === 1 ? (
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                <span>Top Pick</span>
              </div>
            ) : (
              <span>Rank #{rank}</span>
            )}
          </Badge>
          <Badge className="bg-indigo-100 text-indigo-700 border-0 font-bold">{cutoff.toFixed(1)}</Badge>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <School className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
          <h3 className="font-semibold text-gray-800 line-clamp-2">{collegeName}</h3>
        </div>

        <div className="mt-auto">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-0 font-medium">
            {departmentName}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

