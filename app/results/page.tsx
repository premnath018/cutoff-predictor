"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  School,
  BookOpen,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowLeft,
  Lightbulb,
  Building,
  Award,
} from "lucide-react";
import ResultsHeader from "@/components/results-header";
import CollegeCard from "@/components/college-card";
import DepartmentCard from "@/components/department-card";
import WorthAssessment from "@/components/worth-assessment";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type PredictionResult = {
  predicted_cutoff: number;
  your_cutoff: number;
  eligible: boolean;
  college_suggestions: {
    college_name: string | null;
    department: string | null;
    cutoff_bc: number | null;
  }[];
  department_suggestions: {
    college_name: string | null;
    department: string | null;
    cutoff_bc: number | null;
  }[];
  top_colleges: {
    college_name: string | null;
    department: string | null;
    cutoff_bc: number | null;
  }[];
  worth_assessment: {
    college_avg_cutoff: number;
    department_avg_cutoff: number;
    overall_avg_cutoff: number;
    difference_from_college_avg: number;
    difference_from_department_avg: number;
    difference_from_overall_avg: number;
    is_worth_it: string;
  };
  selected_college: string;
  selected_department: string;
};

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      const college = searchParams.get("college");
      const department = searchParams.get("department");
      const caste = searchParams.get("caste");
      const your_cutoff = searchParams.get("your_cutoff");

      if (!college || !department || !caste || !your_cutoff) {
        setErrorMessage("Missing required parameters.");
        setTimeout(() => router.push("/"), 5000);
        setIsLoading(false);
        return;
      }

      const cutoffNum = parseFloat(your_cutoff);
      if (isNaN(cutoffNum)) {
        setErrorMessage("Please provide a valid cutoff score.");
        setTimeout(() => router.push("/"), 5000);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://funny-barry-premnath018-a691593f.koyeb.app/api/predict",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              college,
              department,
              caste,
              your_cutoff: cutoffNum,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Server error: ${response.status}`
          );
        }

        // Sanitize NaN to null and parse response
        const rawText = await response.text();
        const sanitizedText = rawText.replace(/NaN/g, "null");
        let data: PredictionResult = JSON.parse(sanitizedText);

        // Filter out rows with null values
        const filterRows = (array: any[]) =>
          array.filter(
            (item) =>
              item.college_name != null &&
              item.department != null &&
              item.cutoff_bc != null
          );

        data.college_suggestions = filterRows(data.college_suggestions);
        data.department_suggestions = filterRows(data.department_suggestions);
        data.top_colleges = filterRows(data.top_colleges);

        setPredictionResult(data);
      } catch (error: any) {
        console.error("Error fetching prediction:", error);
        setErrorMessage(
          error.message ||
            "Failed to process prediction data. Please try again."
        );
        setTimeout(() => {
          router.push("/");
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrediction();
  }, [searchParams, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="text-center p-6 bg-white rounded-lg shadow-lg border border-red-200"
        >
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700">Error</h2>
          <p className="text-gray-600 mt-2">{errorMessage}</p>
          <p className="text-gray-500 mt-4">Redirecting back in 5 seconds...</p>
        </motion.div>
      </div>
    );
  }

  if (isLoading || !predictionResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{
              rotate: {
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              scale: {
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            className="mx-auto mb-4"
          >
            <Sparkles className="h-16 w-16 text-indigo-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-indigo-700">
            Analyzing your chances...
          </h2>
          <p className="text-gray-600 mt-2">
            Crunching the numbers to find your perfect match
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-10 px-4 sm:px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <ResultsHeader
            yourCutoff={predictionResult.your_cutoff}
            predictedCutoff={predictionResult.predicted_cutoff}
            eligible={predictionResult.eligible}
            selectedCollege={predictionResult.selected_college}
            selectedDepartment={predictionResult.selected_department}
            caste={searchParams.get("caste") || "BC"}
          />
        </motion.div>

        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={itemVariants}
        >
          <motion.div
            className="md:col-span-2"
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="border-0 shadow-lg bg-white overflow-hidden h-full">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Admission Prediction
                </CardTitle>
                <CardDescription>
                  Based on your cutoff score of {predictionResult.your_cutoff}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: 0.5,
                      duration: 0.8,
                    }}
                    className="mb-6"
                  >
                    {predictionResult.eligible ? (
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          className="absolute -inset-4 rounded-full bg-green-200 blur-md z-0"
                        />
                        <CheckCircle className="h-24 w-24 text-green-500 relative z-10" />
                      </div>
                    ) : (
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          className="absolute -inset-4 rounded-full bg-red-200 blur-md z-0"
                        />
                        <XCircle className="h-24 w-24 text-red-500 relative z-10" />
                      </div>
                    )}
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {predictionResult.eligible
                      ? "You are eligible!"
                      : "You missed by a small margin"}
                  </h3>

                  <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">
                        Predicted Cutoff
                      </p>
                      <p className="text-2xl font-bold text-indigo-700">
                        {predictionResult.predicted_cutoff.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Your Cutoff</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {predictionResult.your_cutoff.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="w-full max-w-md mt-6">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          predictionResult.eligible
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            (predictionResult.your_cutoff /
                              predictionResult.predicted_cutoff) *
                            100
                          }%`,
                        }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>0</span>
                      <span>200</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <WorthAssessment
              worthData={predictionResult.worth_assessment}
              selectedCollege={predictionResult.selected_college}
              selectedDepartment={predictionResult.selected_department}
            />
          </motion.div>
        </motion.div>

        <motion.div className="mt-8" variants={itemVariants}>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-70 blur-sm"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <TabsList className="relative grid w-full grid-cols-3 mb-8 p-1 bg-white/80 backdrop-blur-sm">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  <Building className="h-4 w-4 mr-2" />
                  College Options
                </TabsTrigger>
                <TabsTrigger
                  value="departments"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Department Options
                </TabsTrigger>
                <TabsTrigger
                  value="top"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Top Colleges
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="overview" className="mt-0">
                  <Card className="border-0 shadow-lg bg-white overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <School className="h-5 w-5 text-blue-600" />
                        Alternative Departments in{" "}
                        {predictionResult.selected_college}
                      </CardTitle>
                      <CardDescription>
                        Other departments you can consider in your preferred
                        college
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {predictionResult.college_suggestions.length > 0 ? (
                          predictionResult.college_suggestions.map(
                            (college, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  transition: { delay: index * 0.1 },
                                }}
                                whileHover={{
                                  y: -5,
                                  transition: { duration: 0.2 },
                                }}
                              >
                                <CollegeCard
                                  rank={index + 1}
                                  collegeName={college.college_name!}
                                  departmentName={college.department!}
                                  cutoff={college.cutoff_bc!} // Non-null assertion since filtered
                                  isHighlighted={index === 0}
                                />
                              </motion.div>
                            )
                          )
                        ) : (
                          <p className="text-gray-500">
                            No alternative departments available.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="departments" className="mt-0">
                  <Card className="border-0 shadow-lg bg-white overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                        {predictionResult.selected_department} in Other Colleges
                      </CardTitle>
                      <CardDescription>
                        Other colleges offering your preferred department
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {predictionResult.department_suggestions.length > 0 ? (
                          predictionResult.department_suggestions.map(
                            (dept, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  transition: { delay: index * 0.1 },
                                }}
                                whileHover={{
                                  y: -5,
                                  transition: { duration: 0.2 },
                                }}
                              >
                                <DepartmentCard
                                  rank={index + 1}
                                  collegeName={dept.college_name!}
                                  departmentName={dept.department!}
                                  cutoff={dept.cutoff_bc!} // Non-null assertion since filtered
                                  isHighlighted={index === 0}
                                />
                              </motion.div>
                            )
                          )
                        ) : (
                          <p className="text-gray-500">
                            No other colleges available for this department.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="top" className="mt-0">
                  <Card className="border-0 shadow-lg bg-white overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        Top Colleges Overall
                      </CardTitle>
                      <CardDescription>
                        Best colleges based on cutoff scores
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {predictionResult.top_colleges.length > 0 ? (
                          predictionResult.top_colleges
                            .slice(0, 3)
                            .map((college, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  transition: { delay: index * 0.1 },
                                }}
                                whileHover={{
                                  y: -5,
                                  transition: { duration: 0.2 },
                                }}
                              >
                                <CollegeCard
                                  rank={index + 1}
                                  collegeName={college.college_name!}
                                  departmentName={college.department!}
                                  cutoff={college.cutoff_bc!} // Non-null assertion since filtered
                                  isHighlighted={index === 0}
                                  isTop={true}
                                />
                              </motion.div>
                            ))
                        ) : (
                          <p className="text-gray-500">
                            No top colleges available.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center gap-4"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-6 py-5 text-base font-medium shadow-md"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Start New Prediction
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          variants={itemVariants}
        >
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 inline-block max-w-2xl">
            <p className="text-sm font-medium">
              <strong>Disclaimer:</strong> These predictions are based on
              historical data and trends and are not guaranteed outcomes. Use
              this tool as a reference only. Actual results may vary due to
              multiple factors.
            </p>
          </div>
          <p>
            TNEA 2025 Cutoff Prediction • Based on historical data and trends (
            2021 - 2024)
          </p>
        </motion.div>

        <motion.div
          className="mt-4 text-center text-gray-800 text-xs"
          variants={itemVariants}
        >
          <p>
            Developed with 💡✨ by
            <a
              href="https://www.linkedin.com/in/nagadeepak61"
              target="_blank"
              className="text-blue-600 font-semibold"
            >
              {" "}
              Naga Deepak{" "}
            </a>
            using an ML Model 🤖, powered by{" "}
            <strong className="text-red-500">🔥 Grok</strong> from xAI and
            <strong className="text-purple-600"> 🚀 Vercel V0</strong>, and
            seamlessly deployed by
            <a
              href="https://www.linkedin.com/in/premnath018"
              target="_blank"
              className="text-blue-600 font-semibold"
            >
              {" "}
              Premnath
            </a>{" "}
            🎯.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
