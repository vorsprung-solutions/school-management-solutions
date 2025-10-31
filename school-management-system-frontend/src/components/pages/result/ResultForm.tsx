"use client";

import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import ShowResult from "./ShowResult";
import { useGetAllExamsByDomainQuery } from "@/redux/features/exam/examApi";
import { IExam } from "@/types/exam";
import { Loader2 } from "lucide-react";

type StudentInfo = {
  education_level: string;
  department: string;
  class_name: string;
  session: string;
  exam: string;
};

export default function ResultForm() {
  const { register, handleSubmit, reset } = useForm<StudentInfo>();

  // Fetch exams from API using domain
  const domain = window.location.hostname;
  const { data: examsData, isLoading: isLoadingExams } = useGetAllExamsByDomainQuery(domain);

  const onSubmit: SubmitHandler<StudentInfo> = async (data) => {
    console.log(data);
    reset();
  };

  const exams = examsData?.data || [];

  return (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto space-y-4 bg-white rounded-2xl shadow-lg"
      >
        <div className="bg-[#4F80EE] w-full h-10 rounded-t-2xl"></div>
        <div className="p-6 pt-0 space-y-3">
          {/* select Education Level */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Education Level
            </label>
            <select
              {...register("education_level", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            >
              <option value="">Select Education Level</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          {/* select Department */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Department
            </label>
            <select
              {...register("department", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            >
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="BBA">BBA</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* select Class Name */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Class Name
            </label>
            <select
              {...register("class_name", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            >
              <option value="">Select Class Name</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
            </select>
          </div>

          {/* Select Session */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Session
            </label>
            <select
              {...register("session", { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            >
              <option value="">Select Session</option>
              <option value="2022-2023">2022-2023</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>

          {/* Select Exam name */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Exam Name
            </label>
            {isLoadingExams ? (
              <div className="w-full border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading exams...
              </div>
            ) : (
              <select
                {...register("exam", { required: true })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
              >
                <option value="">Select Exam</option>
                {exams.length === 0 ? (
                  <option value="" disabled>
                    No exams available
                  </option>
                ) : (
                  Array.isArray(exams) && exams.map((exam: IExam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.examName}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          <div className="text-center mt-6">
            <Button className="bg-[#4F80EE] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition">
              View Result
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-10">
        <ShowResult />
      </div>
    </div>
  );
}
