"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, School, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResultsHeaderProps {
  yourCutoff: number;
  predictedCutoff: number;
  eligible: boolean;
  selectedCollege: string;
  selectedDepartment: string;
  caste: string;
}

export default function ResultsHeader({
  yourCutoff,
  predictedCutoff,
  eligible,
  selectedCollege,
  selectedDepartment,
  caste,
}: ResultsHeaderProps) {
  return (
    <div className="text-center">
      <motion.h1
        className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your TNEA Prediction Results
      </motion.h1>

      <motion.div
        className="max-w-3xl mx-auto mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-xl text-gray-600">
          Based on your cutoff score of{" "}
          <span className="font-bold text-blue-700">{yourCutoff}</span> for{" "}
          <span className="font-bold text-indigo-700">{caste}</span> category
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-md">
          <School className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-700">College:</span>
          <span className="font-bold text-gray-900">{selectedCollege}</span>
        </div>

        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-md">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <span className="font-medium text-gray-700">Department:</span>
          <span className="font-bold text-gray-900">{selectedDepartment}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
      >
        <Badge
          className={`text-lg font-medium py-2 px-6 ${
            eligible
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
          } text-white shadow-md`}
        >
          {eligible ? (
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Eligible for Admission</span>
            </div>
          ) : (
            <div className="flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              <span>
                Missed by {(predictedCutoff - yourCutoff).toFixed(1)} Marks
              </span>
            </div>
          )}
        </Badge>
      </motion.div>
    </div>
  );
}
