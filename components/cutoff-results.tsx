import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle } from "lucide-react"

interface CutoffResultsProps {
  prediction: string
  userCutoff: string
  isEligible: boolean
  suggestions: { college_name: string; cutoff: string }[]
  selectedDepartment: string
}

export default function CutoffResults({
  prediction,
  userCutoff,
  isEligible,
  suggestions,
  selectedDepartment,
}: CutoffResultsProps) {
  return (
    <div className="mt-8 space-y-6">
      <Card className={`border-2 ${isEligible ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {isEligible ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>

            <h3 className="text-2xl font-bold mb-4">{isEligible ? "You are eligible!" : "Not eligible"}</h3>

            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="text-center">
                <p className="text-sm text-gray-500">Predicted Cutoff</p>
                <p className="text-xl font-bold">{prediction}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Your Cutoff</p>
                <p className="text-xl font-bold">{userCutoff}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isEligible && suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">Top Suggestions for Your Cutoff</h3>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Top Colleges for {selectedDepartment}</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>College Name</TableHead>
                    <TableHead className="text-right">Cutoff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.map((suggestion, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-blue-50" : ""}>
                      <TableCell className="font-medium">{suggestion.college_name}</TableCell>
                      <TableCell className="text-right">{suggestion.cutoff}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

