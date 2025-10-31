"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Loader2,
  FileText,
  Download,
  Printer,
  XCircle,
  CheckCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { useGetSingleResultQuery } from "@/redux/features/result/resultApi";
import { GradeEnum } from "@/types/result";

export default function StudentResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const {
    data: resultData,
    isLoading,
    error,
  } = useGetSingleResultQuery(resultId);
  const result = resultData?.data;

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

  const handlePrint = () => {
    // const printContent = `
    //   Exam Result

    //   Student Information:
    //   Name: ${typeof result?.student === 'string' ? 'Unknown' : result?.student?.name || 'Unknown'}
    //   Roll Number: ${typeof result?.student === 'string' ? 'Unknown' : result?.student?.roll_no || 'Unknown'}

    //   Exam Information:
    //   Exam: ${typeof result?.exam === 'string' ? 'Unknown' : result?.exam?.examName || 'Unknown'}
    //   Year: ${result?.year}
    //   Class: ${result?.class}
    //   Session: ${result?.session}
    //   Group: ${result?.group || 'N/A'}

    //   Results:
    //   ${result?.results?.map(subject =>
    //     `${subject.subject}: ${subject.marks} marks, Grade: ${subject.grade}, GPA: ${subject.gpa}`
    //   ).join('\n')}

    //   Overall Performance:
    //   Total Marks: ${result?.total_marks}
    //   GPA: ${result?.gpa}
    //   Grade: ${result?.grade}
    //   Status: ${result?.is_passed ? 'PASSED' : 'FAILED'}
    // `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Exam Result</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .section { margin-bottom: 15px; }
              .subject { margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Exam Result</h1>
            </div>
            <div class="section">
              <h3>Student Information:</h3>
              <p><strong>Name:</strong> ${
                typeof result?.student === "string"
                  ? "Unknown"
                  : result?.student?.name || "Unknown"
              }</p>
              <p><strong>Roll Number:</strong> ${
                typeof result?.student === "string"
                  ? "Unknown"
                  : result?.student?.roll_no || "Unknown"
              }</p>
            </div>
            <div class="section">
              <h3>Exam Information:</h3>
              <p><strong>Exam:</strong> ${
                typeof result?.exam === "string"
                  ? "Unknown"
                  : result?.exam?.examName || "Unknown"
              }</p>
              <p><strong>Year:</strong> ${result?.year}</p>
              <p><strong>Class:</strong> ${result?.class}</p>
              <p><strong>Session:</strong> ${result?.session}</p>
              <p><strong>Group:</strong> ${result?.group || "N/A"}</p>
            </div>
            <div class="section">
              <h3>Results:</h3>
              ${result?.results
                ?.map(
                  (subject) =>
                    `<div class="subject"><strong>${subject.subject}:</strong> ${subject.marks} marks, Grade: ${subject.grade}, GPA: ${subject.gpa}</div>`
                )
                .join("")}
            </div>
            <div class="section">
              <h3>Overall Performance:</h3>
              <p><strong>Total Marks:</strong> ${result?.total_marks}</p>
              <p><strong>GPA:</strong> ${result?.gpa}</p>
              <p><strong>Grade:</strong> ${result?.grade}</p>
              <p><strong>Status:</strong> ${
                result?.is_passed ? "PASSED" : "FAILED"
              }</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const examName =
      typeof result?.exam === "string"
        ? "unknown"
        : result?.exam?.examName || "unknown";
    const fileName = `result_${
      typeof result?.student === "string"
        ? "unknown"
        : result?.student?.roll_no || "unknown"
    }_${examName}.txt`;

    const content = `
Exam Result

Student Information:
Name: ${
      typeof result?.student === "string"
        ? "Unknown"
        : result?.student?.name || "Unknown"
    }
Roll Number: ${
      typeof result?.student === "string"
        ? "Unknown"
        : result?.student?.roll_no || "Unknown"
    }

Exam Information:
Exam: ${
      typeof result?.exam === "string"
        ? "Unknown"
        : result?.exam?.examName || "Unknown"
    }
Year: ${result?.year}
Class: ${result?.class}
Session: ${result?.session}
Group: ${result?.group || "N/A"}

Results:
${result?.results
  ?.map(
    (subject) =>
      `${subject.subject}: ${subject.marks} marks, Grade: ${subject.grade}, GPA: ${subject.gpa}`
  )
  .join("\n")}

Overall Performance:
Total Marks: ${result?.total_marks}
GPA: ${result?.gpa}
Grade: ${result?.grade}
Status: ${result?.is_passed ? "PASSED" : "FAILED"}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Result Not Found
          </h3>
          <p className="text-gray-600">
            The requested result could not be found.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Result Details</h1>
            <p className="text-gray-600">
              {typeof result.exam === "string"
                ? "Unknown"
                : result.exam?.examName || "Unknown"}{" "}
              - {result.year}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Student Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">
                {typeof result.student === "string"
                  ? "Unknown"
                  : result.student?.name || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Roll Number</p>
              <p className="font-medium">
                {typeof result.student === "string"
                  ? "Unknown"
                  : result.student?.roll_no ||
                    result.student?.rollNumber ||
                    result.student?.roll ||
                    "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registration Number</p>
              <p className="font-medium">
                {typeof result.student === "string"
                  ? "Unknown"
                  : result.student?.reg_no ||
                    result.student?.regNumber ||
                    result.student?.registration_no ||
                    "Unknown"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Exam Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Exam Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Exam Name</p>
              <p className="font-medium">
                {typeof result.exam === "string"
                  ? "Unknown"
                  : result.exam?.examName || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Year</p>
              <p className="font-medium">{result.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-medium">{result.class}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Session</p>
              <p className="font-medium">{result.session}</p>
            </div>
            {result.group && (
              <div>
                <p className="text-sm text-gray-600">Group</p>
                <p className="font-medium">{result.group}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Total Marks</p>
              <p className="text-xl font-bold text-blue-600">
                {result.total_marks}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">GPA</p>
              <p className="text-xl font-bold text-green-600">
                {result.gpa.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grade</p>
              <Badge className={`text-sm ${getGradeColor(result.grade)}`}>
                {result.grade}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <div className="flex items-center gap-2">
                {result.is_passed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Results */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.results?.map((subject, index) => (
              <div key={index}>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {subject.subject}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Marks: {subject.marks}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Grade</p>
                      <Badge className={getGradeColor(subject.grade)}>
                        {subject.grade}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">GPA</p>
                      <p className="font-semibold text-blue-600">
                        {subject.gpa}
                      </p>
                    </div>
                  </div>
                </div>
                {index < result.results.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
