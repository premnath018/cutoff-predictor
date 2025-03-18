"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building2 } from "lucide-react"

interface College {
  id: number
  name: string
  code?: string
  location?: string
}

interface CollegeSearchResultsProps {
  results: College[]
  onSelectCollege: (college: College) => void
}

export default function CollegeSearchResults({ results, onSelectCollege }: CollegeSearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {/* Initial state or no results */}
        <Building2 className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-2">
          {results.length === 0 ? "Enter at least 3 characters to search for colleges" : "No colleges found"}
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <div className="p-4 space-y-3">
        {results.map((college) => (
          <Card
            key={college.id}
            className="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
            onClick={() => onSelectCollege(college)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{college.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {college.code && <span>Code: {college.code}</span>}
                  {college.location && (
                    <>
                      <span>•</span>
                      <span>{college.location}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-blue-600 text-sm font-medium">Select</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

