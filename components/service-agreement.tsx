"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

interface ServiceAgreementProps {
  onAgree: () => void;
}

export default function ServiceAgreement({ onAgree }: ServiceAgreementProps) {
  const [timeLeft, setTimeLeft] = useState(7); // 7 seconds mandatory wait

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-yellow-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-yellow-700 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Service Agreement & Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Please read and acknowledge the following before proceeding:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>
                These details and predictions are based on historical data and
                trends and cannot guarantee your actual admission outcome. Use
                this as a reference only, not a guaranteed result.
              </li>
              <li>
                Cutoff scores may vary due to factors like seat availability,
                applicant volume, and policy changes not reflected in our data.
              </li>
              <li>
                The accuracy of predictions depends on the information you
                provide; incorrect or incomplete data may lead to misleading
                results.
              </li>
              <li>
                We are not affiliated with TNEA or any official admission body;
                this tool is for informational purposes only.
              </li>
            </ul>
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-500">
                You can agree in {timeLeft} second{timeLeft !== 1 ? "s" : ""}...
              </p>
              <motion.div
                whileHover={timeLeft === 0 ? { scale: 1.05 } : {}}
                whileTap={timeLeft === 0 ? { scale: 0.95 } : {}}
              >
                <Button
                  onClick={onAgree}
                  disabled={timeLeft > 0}
                  className={`bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 ${
                    timeLeft === 0
                      ? "opacity-100"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  I Agree
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
