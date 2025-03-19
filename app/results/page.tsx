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
  Building,
  Award,
  Share2,
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
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  // For mobile responsiveness
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // Function to share via WhatsApp
  const shareViaWhatsApp = () => {
    if (!predictionResult) return;

    const text = `Check my TNEA college prediction for ${predictionResult.selected_college} - ${predictionResult.selected_department}. My cutoff: ${predictionResult.your_cutoff}, Predicted cutoff: ${predictionResult.predicted_cutoff}`;
    const url = window.location.href;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      "_blank"
    );
  };

  // Function for general sharing
  const shareResults = () => {
    if (!predictionResult) return;

    if (navigator.share) {
      navigator
        .share({
          title: "TNEA Counselling College Predictor",
          text: `Check my college prediction for ${predictionResult.selected_college} - ${predictionResult.selected_department}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    }
  };

  const pages = ["overview", "departments", "top"];
  const [pageIndex, setPageIndex] = useState(0);

  // Update setActiveTab to also update pageIndex
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPageIndex(pages.indexOf(value));
  };

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
          className="text-center p-6 bg-white rounded-lg shadow-lg border border-red-200 max-w-md w-full"
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
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
          {isMobile ? (
            // Mobile view with pagination
            <div className="w-full">
              {/* Define pages array with titles */}
              {(() => {
                const pages = [
                  { id: "overview", title: "College Options" },
                  { id: "departments", title: "Department Options" },
                  { id: "top", title: "Top Colleges" },
                ];
                const currentPageIndex = pages.findIndex(
                  (page) => page.id === activeTab
                );

                return (
                  <>
                    <div className="relative">
                      {/* Pagination Controls */}
                      <div className="flex justify-between items-center mb-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const prevIndex = Math.max(currentPageIndex - 1, 0);
                            setActiveTab(pages[prevIndex].id);
                          }}
                          disabled={currentPageIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-center flex-1">
                          {pages[currentPageIndex].title}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const nextIndex = Math.min(
                              currentPageIndex + 1,
                              pages.length - 1
                            );
                            setActiveTab(pages[nextIndex].id);
                          }}
                          disabled={currentPageIndex === pages.length - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {activeTab === "overview" && (
                          <Card className="border-0 shadow-lg bg-white overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <School className="h-5 w-5 text-blue-600" />
                                Alternative Departments
                              </CardTitle>
                              <CardDescription>
                                Other departments in{" "}
                                {predictionResult.selected_college}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6">
                                {predictionResult.college_suggestions.length >
                                0 ? (
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
                                      >
                                        <CollegeCard
                                          rank={index + 1}
                                          collegeName={college.college_name!}
                                          departmentName={college.department!}
                                          cutoff={college.cutoff_bc!}
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
                        )}

                        {activeTab === "departments" && (
                          <Card className="border-0 shadow-lg bg-white overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-indigo-600" />
                                Department Options
                              </CardTitle>
                              <CardDescription>
                                {predictionResult.selected_department} in Other
                                Colleges
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6">
                                {predictionResult.department_suggestions
                                  .length > 0 ? (
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
                                      >
                                        <DepartmentCard
                                          rank={index + 1}
                                          collegeName={dept.college_name!}
                                          departmentName={dept.department!}
                                          cutoff={dept.cutoff_bc!}
                                          isHighlighted={index === 0}
                                        />
                                      </motion.div>
                                    )
                                  )
                                ) : (
                                  <p className="text-gray-500">
                                    No other colleges available for this
                                    department.
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {activeTab === "top" && (
                          <Card className="border-0 shadow-lg bg-white overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                Top Colleges
                              </CardTitle>
                              <CardDescription>
                                Best colleges by cutoff
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6">
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
                                      >
                                        <CollegeCard
                                          rank={index + 1}
                                          collegeName={college.college_name!}
                                          departmentName={college.department!}
                                          cutoff={college.cutoff_bc!}
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
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </>
                );
              })()}
            </div>
          ) : (
            // Desktop view with tabs
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
                                    cutoff={college.cutoff_bc!}
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
                          {predictionResult.selected_department} in Other
                          Colleges
                        </CardTitle>
                        <CardDescription>
                          Other colleges offering your preferred department
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {predictionResult.department_suggestions.length >
                          0 ? (
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
                                    cutoff={dept.cutoff_bc!}
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
                                    cutoff={college.cutoff_bc!}
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
          )}
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-6 py-5 text-base font-medium shadow-md w-full sm:w-auto"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Start New Prediction
            </Button>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* WhatsApp Share Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-5 text-base font-medium shadow-md w-full"
                onClick={shareViaWhatsApp}
              >
                <div className="flex items-center">
                  {/* WhatsApp Icon SVG */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 mr-2 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652c1.73.943 3.683 1.44 5.7 1.44 6.555 0 11.89-5.335 11.893-11.893 0-3.176-1.24-6.165-3.484-8.413" />
                  </svg>
                  <span>Share via WhatsApp</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          variants={itemVariants}
        >
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 inline-block max-w-2xl">
            <p className="text-sm font-medium">
              <strong>Disclaimer:</strong> These predictions are based on
              historical data and trends and are not guaranteed outcomes. Some
              results may not provide suggestions due to technical errors, and
              others may be incorrect. Kindly refer to older data for
              reconfirmation. Use this tool as a reference only. Actual results
              may vary due to multiple factors.
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
              rel="noreferrer"
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
              rel="noreferrer"
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
