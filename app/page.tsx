"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Check,
  ChevronsUpDown,
  Sparkles,
  School,
  BookOpen,
  ArrowRight,
  GraduationCap,
  BookMarked,
  BarChart3,
  Trophy,
} from "lucide-react";
import collegeData from "@/lib/college_data.json";
import ServiceAgreement from "@/components/service-agreement";

// Combobox component with full-width styling
function Combobox({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-10 justify-between border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 pl-10 pr-2 text-left",
            className,
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    college: "",
    department: "",
    caste: "",
    your_cutoff: "",
  });
  const [showAgreement, setShowAgreement] = React.useState(false);

  // Check if we should show the agreement (once per hour)
  React.useEffect(() => {
    const lastShown = localStorage.getItem("agreementLastShown");
    const currentTime = new Date().getTime();

    if (
      !lastShown ||
      currentTime - Number.parseInt(lastShown) > 60 * 60 * 1000
    ) {
      // 1 hour
      setShowAgreement(true);
    }
  }, []);

  // College options
  const collegeOptions = React.useMemo(
    () =>
      Object.keys(collegeData).map((college) => ({
        value: college,
        label: college,
      })),
    []
  );

  // Department options based on selected college
  const departmentOptions = React.useMemo(() => {
    if (!formData.college || !collegeData[formData.college]) return [];
    return collegeData[formData.college].departments.map((dept) => ({
      value: dept,
      label: dept,
    }));
  }, [formData.college]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "college") {
        newData.department = ""; // Reset department when college changes
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCollegeName = formData.college.replace(/^\d+\s*-\s*/, "");
    const query = new URLSearchParams({
      college: cleanCollegeName,
      department: formData.department,
      caste: formData.caste,
      your_cutoff: formData.your_cutoff,
    }).toString();
    router.push(`/results?${query}`);
  };

  const handleAgree = () => {
    setShowAgreement(false);
    localStorage.setItem("agreementLastShown", new Date().getTime().toString());
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const floatingIconVariants = {
    initial: { y: 0, opacity: 0.7 },
    animate: {
      y: [-10, 10, -10],
      opacity: [0.7, 1, 0.7],
      transition: {
        y: { repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" },
        opacity: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {showAgreement && <ServiceAgreement onAgree={handleAgree} />}
      </AnimatePresence>

      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-10 px-4 sm:px-6 overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 text-blue-300 opacity-20"
            variants={floatingIconVariants}
            initial="initial"
            animate="animate"
          >
            <GraduationCap size={80} />
          </motion.div>

          <motion.div
            className="absolute top-40 right-20 text-indigo-300 opacity-20"
            variants={floatingIconVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5 }}
          >
            <BookMarked size={60} />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-20 text-purple-300 opacity-20"
            variants={floatingIconVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 1 }}
          >
            <BarChart3 size={70} />
          </motion.div>

          <motion.div
            className="absolute bottom-60 right-10 text-pink-300 opacity-20"
            variants={floatingIconVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 1.5 }}
          >
            <Trophy size={50} />
          </motion.div>
        </div>

        <motion.div
          className="max-w-4xl mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1], // Spring-like effect
              }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 mb-4">
                TNEA Counselling College Predictor 2025
              </h1>
            </motion.div>

            <motion.p
              className="mt-3 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Find your perfect college match based on your cutoff score and
              preferences
            </motion.p>
          </motion.div>

          <motion.div
            className="relative mb-16"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl transform rotate-1 opacity-10"
              animate={{
                rotate: [1, 2, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 5,
                    }}
                    className="inline-block"
                  >
                    <Sparkles className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Enter Your Details
                  </CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    className="space-y-2"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <Label htmlFor="college" className="text-sm font-medium">
                      College Name
                    </Label>
                    <div className="relative">
                      <School className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 z-10" />
                      <Combobox
                        options={collegeOptions}
                        value={formData.college}
                        onChange={(value) => handleChange("college", value)}
                        placeholder="Select your college"
                        className="w-full"
                        disabled={showAgreement} // Disable while popup is active
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <Label htmlFor="department" className="text-sm font-medium">
                      Department
                    </Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 z-10" />
                      <Combobox
                        options={departmentOptions}
                        value={formData.department}
                        onChange={(value) => handleChange("department", value)}
                        placeholder="Select your department"
                        disabled={!formData.college || showAgreement}
                        className="w-full"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <Label htmlFor="caste" className="text-sm font-medium">
                      Category
                    </Label>
                    <div className="relative">
                      <Combobox
                        options={[
                          { value: "OC", label: "OC" },
                          { value: "BC", label: "BC" },
                          { value: "MBC", label: "MBC" },
                          { value: "BCM", label: "BCM" },
                          { value: "SC", label: "SC" },
                          { value: "ST", label: "ST" },
                          { value: "SCA", label: "SCA" },
                        ]}
                        value={formData.caste}
                        onChange={(value) => handleChange("caste", value)}
                        placeholder="Select your category"
                        className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={showAgreement}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <Label htmlFor="cutoff" className="text-sm font-medium">
                      Your Cutoff
                    </Label>
                    <Input
                      id="cutoff"
                      type="number"
                      step="0.5"
                      min="77"
                      max="200"
                      value={formData.your_cutoff}
                      onChange={(e) =>
                        handleChange("your_cutoff", e.target.value)
                      }
                      placeholder="Enter your cutoff score"
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 h-10"
                      required
                      disabled={showAgreement}
                    />
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full py-6 text-lg font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg"
                      disabled={showAgreement} // Disable button until agreed
                    >
                      <motion.span
                        className="flex items-center"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <span className="mr-2">Predict My Chances</span>
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="mt-8 text-center text-gray-500 text-sm"
            variants={itemVariants}
          >
            <motion.div
              className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 inline-block max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm font-medium">
                <strong>Disclaimer:</strong> These predictions are based on
                historical data and trends and are not guaranteed outcomes. Use
                this tool as a reference only. Actual results may vary due to
                multiple factors.
              </p>
            </motion.div>

            <p>
              TNEA 2025 Cutoff Prediction • Based on historical data and trends
              (2021 - 2024)
            </p>
          </motion.div>

          <motion.div
            className="mt-4 text-center text-gray-800 text-xs"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>
              Developed with 💡✨ by
              <a
                href="https://www.linkedin.com/in/nagadeepak61"
                target="_blank"
                className="text-blue-600 font-semibold"
                rel="noreferrer"
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
                rel="noreferrer"
              >
                {" "}
                Premnath
              </a>{" "}
              🎯.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
