"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, TrendingUp } from "lucide-react"

interface WorthAssessmentProps {
  worthData: {
    college_avg_cutoff: number
    department_avg_cutoff: number
    overall_avg_cutoff: number
    difference_from_college_avg: number
    difference_from_department_avg: number
    difference_from_overall_avg: number
    is_worth_it: string
  }
  selectedCollege: string
  selectedDepartment: string
}

export default function WorthAssessment({ worthData, selectedCollege, selectedDepartment }: WorthAssessmentProps) {
  // Get worth assessment label and color
  const getWorthLabel = (worth) => {
    switch (worth) {
      case "excellent_value":
        return { label: "Excellent Value", color: "text-green-600", bg: "bg-green-100" }
      case "good_value":
        return { label: "Good Value", color: "text-emerald-600", bg: "bg-emerald-100" }
      case "fair_value":
        return { label: "Fair Value", color: "text-blue-600", bg: "bg-blue-100" }
      case "poor_value":
        return { label: "Poor Value", color: "text-orange-600", bg: "bg-orange-100" }
      default:
        return { label: "Not Assessed", color: "text-gray-600", bg: "bg-gray-100" }
    }
  }

  const worthInfo = getWorthLabel(worthData.is_worth_it)

  // Calculate normalized scores for visualization
  const collegeScore = Math.min(100, (worthData.difference_from_college_avg / 10) * 100)
  const departmentScore = Math.min(100, (worthData.difference_from_department_avg / 50) * 100)
  const overallScore = Math.min(100, (worthData.difference_from_overall_avg / 40) * 100)

  return (
    <Card className="border-0 shadow-lg bg-white overflow-hidden h-full">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          Value Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex justify-center mb-2">
          <Badge className={`${worthInfo.bg} ${worthInfo.color} text-base py-1.5 px-4 border-0`}>
            {worthInfo.label}
          </Badge>
        </div>

        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">College Premium</span>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm font-bold text-blue-700">
                  +{worthData.difference_from_college_avg.toFixed(1)}
                </span>
              </div>
            </div>
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.6 }}>
              <Progress value={collegeScore} className="h-2" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Department Premium</span>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm font-bold text-purple-700">
                  +{worthData.difference_from_department_avg.toFixed(1)}
                </span>
              </div>
            </div>
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.8 }}>
              <Progress value={departmentScore} className="h-2" />
            </motion.div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Premium</span>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-indigo-500 mr-1" />
                <span className="text-sm font-bold text-indigo-700">
                  +{worthData.difference_from_overall_avg.toFixed(1)}
                </span>
              </div>
            </div>
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 1 }}>
              <Progress value={overallScore} className="h-2" />
            </motion.div>
          </div>
        </motion.div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 italic">
            Assessment based on historical cutoff trends and placement statistics
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

