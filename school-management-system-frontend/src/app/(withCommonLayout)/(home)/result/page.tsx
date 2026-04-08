"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Printer,
  FileText,
  Loader2,
  RotateCcw,
  Eye,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useGetResultsByDomainQuery } from "@/redux/features/result/resultApi";
import { useGetAllExamsByDomainQuery } from "@/redux/features/exam/examApi";
import { IResult, GradeEnum, ResultFilters } from "@/types/result";
import { IExam } from "@/types/exam";
import useDomain from "@/hooks/useDomain";

type SearchFilters = {
  exam?: string;
  class?: number;
  session?: number;
  rollNumber?: string;
};

export default function ResultPage() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<IResult | null>(null);

  const domain = useDomain();

  const { data: examsData, isLoading: isLoadingExams } =
    useGetAllExamsByDomainQuery(domain);
  const { data: resultsData, isLoading: isLoadingResults } =
    useGetResultsByDomainQuery(
      {
        domain,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      },
      {
        skip: !isSearching && Object.keys(filters).length === 0,
      }
    );

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<SearchFilters>();
  const watchedFilters = watch();

  const exams = examsData?.data || [];
  const results = resultsData?.data || [];

  const onSubmit = async (data: ResultFilters) => {
    // Convert string values to numbers where needed and handle "all" value
    const processedData = {
      ...data,
      class: data.class ? Number(data.class) : undefined,
      session: data.session ? Number(data.session) : undefined,
      exam: data.exam === "all" ? undefined : data.exam,
    };
    setFilters(processedData);
    setIsSearching(true);
  };

  const clearFilters = () => {
    reset();
    setFilters({});
    setIsSearching(false);
    setSelectedResult(null);
  };

  const handlePrint = (result: IResult) => {
    const examName =
      typeof result.exam === "string"
        ? "Unknown Exam"
        : result.exam?.examName || "Unknown Exam";
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Result - ${examName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .student-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .summary { margin-top: 20px; padding: 15px; background-color: #f9f9f9; }
              .passed { color: green; font-weight: bold; }
              .failed { color: red; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${examName}</h1>
              <p>Year: ${result.year} | Class: ${result.class} | Session: ${
        result.session
      }</p>
              ${result.group ? `<p>Group: ${result.group}</p>` : ""}
            </div>
            
            <div class="student-info">
              <h3>Student Information</h3>
              <p><strong>Name:</strong> ${
                typeof result.student === "string"
                  ? "Unknown"
                  : result.student?.name || "Unknown"
              }</p>
                             <p><strong>Roll Number:</strong> ${
                               typeof result.student === "string"
                                 ? "Unknown"
                                 : result.student?.roll_no || "Unknown"
                             }</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>GPA</th>
                </tr>
              </thead>
              <tbody>
                ${result.results
                  .map(
                    (subject) => `
                  <tr>
                    <td>${subject.subject}</td>
                    <td>${subject.marks}</td>
                    <td>${subject.grade}</td>
                    <td>${subject.gpa.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="summary">
              <p><strong>Total Marks:</strong> ${result.total_marks}</p>
              <p><strong>Overall GPA:</strong> ${result.gpa.toFixed(2)}</p>
              <p><strong>Grade:</strong> ${result.grade}</p>
              <p class="${result.is_passed ? "passed" : "failed"}">
                <strong>Status:</strong> ${
                  result.is_passed ? "PASSED" : "FAILED"
                }
              </p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = (result: IResult) => {
    const examName =
      typeof result.exam === "string"
        ? "Unknown Exam"
        : result.exam?.examName || "Unknown Exam";
    const content = `
Result Certificate
==================

Exam: ${examName}
Year: ${result.year}
Class: ${result.class}
Session: ${result.session}
${result.group ? `Group: ${result.group}` : ""}

Student Information:
-------------------
Name: ${
      typeof result.student === "string"
        ? "Unknown"
        : result.student?.name || "Unknown"
    }
Roll Number: ${
      typeof result.student === "string"
        ? "Unknown"
        : result.student?.roll_no || "Unknown"
    }

Subject Results:
---------------
${result.results
  .map(
    (subject) =>
      `${subject.subject}: ${subject.marks} marks, Grade: ${
        subject.grade
      }, GPA: ${subject.gpa.toFixed(2)}`
  )
  .join("\n")}

Summary:
--------
Total Marks: ${result.total_marks}
Overall GPA: ${result.gpa.toFixed(2)}
Grade: ${result.grade}
Status: ${result.is_passed ? "PASSED" : "FAILED"}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `result_${
      typeof result.student === "string"
        ? "unknown"
        : result.student?.roll_no || "unknown"
    }_${examName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getGradeColor = (grade: GradeEnum) => {
    switch (grade) {
      case GradeEnum.A_PLUS:
      case GradeEnum.A:
        return "bg-green-100 text-green-800";
      case GradeEnum.A_MINUS:
      case GradeEnum.B_PLUS:
      case GradeEnum.B:
        return "bg-blue-100 text-blue-800";
      case GradeEnum.B_MINUS:
      case GradeEnum.C_PLUS:
      case GradeEnum.C:
        return "bg-yellow-100 text-yellow-800";
      case GradeEnum.C_MINUS:
      case GradeEnum.D_PLUS:
      case GradeEnum.D:
        return "bg-orange-100 text-orange-800";
      case GradeEnum.F:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Student Result Search
        </h1>
        <p className="text-gray-600">
          Enter your details to find your exam results
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Your Result
          </CardTitle>
          <p className="text-sm text-gray-600">
            Enter your details to find your exam results. For privacy, when you
            provide your roll number, you will only see your own results.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Roll Number - Required */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("rollNumber", {
                    required: "Roll number is required",
                  })}
                  placeholder="Enter roll number"
                />
              </div>

              {/* Class - Required */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Class <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("class", { required: "Class is required" })}
                  type="number"
                  placeholder="Enter class"
                />
              </div>

              {/* Session - Required */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Session <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("session", { required: "Session is required" })}
                  type="number"
                  placeholder="Enter session"
                />
              </div>

              {/* Exam - Required */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Exam <span className="text-red-500">*</span>
                </label>
                {isLoadingExams ? (
                  <div className="flex items-center justify-center h-10 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <Select
                    value={watchedFilters.exam || "all"}
                    onValueChange={(value) =>
                      setValue("exam", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      {Array.isArray(exams) &&
                        exams.map((exam: IExam) => (
                          <SelectItem key={exam._id} value={exam._id!}>
                            {exam.examName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="submit"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Search className="h-4 w-4" />
                Find Result
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Display */}
      {isSearching && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {filters.rollNumber
                ? `Your Results (${results.length} found)`
                : `Search Results (${results.length} found)`}
            </CardTitle>
            {filters.rollNumber && (
              <p className="text-sm text-gray-600">
                Showing results for roll number: {filters.rollNumber}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {isLoadingResults ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No results found for the given criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result: IResult) => (
                  <Card
                    key={result._id}
                    className="border-l-4 border-l-blue-500"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {typeof result.student === "string"
                              ? "Unknown Student"
                              : result.student?.name || "Unknown Student"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Roll:{" "}
                            {typeof result.student === "string"
                              ? "Unknown"
                              : result.student?.roll_no || "Unknown"}{" "}
                            | Class: {result.class} | Session: {result.session}
                          </p>
                          <p className="text-sm text-gray-600">
                            Exam:{" "}
                            {typeof result.exam === "string"
                              ? "Unknown"
                              : result.exam?.examName || "Unknown"}{" "}
                            | Year: {result.year}
                            {result.group && ` | Group: ${result.group}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedResult(
                                selectedResult?._id === result._id
                                  ? null
                                  : result
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrint(result)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(result)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="flex gap-4 text-sm">
                        <span>
                          Total Marks: <strong>{result.total_marks}</strong>
                        </span>
                        <span>
                          GPA: <strong>{result.gpa.toFixed(2)}</strong>
                        </span>
                        <Badge className={getGradeColor(result.grade)}>
                          Grade: {result.grade}
                        </Badge>
                        <Badge
                          className={
                            result.is_passed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {result.is_passed ? "PASSED" : "FAILED"}
                        </Badge>
                      </div>

                      {/* Detailed Results (Expandable) */}
                      {selectedResult?._id === result._id && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-3">Subject Results</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {result.results.map((subject, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-3 rounded-lg"
                              >
                                <div className="font-medium">
                                  {subject.subject}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Marks: {subject.marks} | GPA:{" "}
                                  {subject.gpa.toFixed(2)}
                                </div>
                                <Badge
                                  className={`mt-1 ${getGradeColor(
                                    subject.grade
                                  )}`}
                                >
                                  {subject.grade}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
