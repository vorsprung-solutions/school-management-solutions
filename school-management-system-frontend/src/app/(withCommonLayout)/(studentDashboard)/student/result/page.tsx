"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Loader2,
  Eye,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useGetMyResultsQuery } from "@/redux/features/result/resultApi";
import { IResult, GradeEnum } from "@/types/result";
import { useRouter } from "next/navigation";

export default function StudentResultPage() {
  const router = useRouter();

  // Get current student's results
  const { data: resultsResponse, isLoading, error } = useGetMyResultsQuery();
  const results = resultsResponse?.data || [];

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

  const handleViewResult = (result: IResult) => {
    router.push(`/student/result/${result._id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Results
          </h3>
          <p className="text-gray-600">
            Failed to load your results. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
          <p className="text-gray-600">
            View all your exam results and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Average GPA</p>
                  <p className="text-xl font-bold text-gray-900">
                    {(
                      results.reduce((sum, result) => sum + result.gpa, 0) /
                      results.length
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Passed Exams</p>
                  <p className="text-xl font-bold text-gray-900">
                    {results.filter((result) => result.is_passed).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Exams</p>
                  <p className="text-xl font-bold text-gray-900">
                    {results.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exam Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600">
                You don&apos;t have any exam results yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result._id}>
                      <TableCell className="font-medium">
                        {typeof result.exam === "string"
                          ? "Unknown"
                          : result.exam?.examName || "Unknown"}
                      </TableCell>
                      <TableCell>{result.year}</TableCell>
                      <TableCell>{result.class}</TableCell>
                      <TableCell>{result.session}</TableCell>
                      <TableCell>{result.total_marks}</TableCell>
                      <TableCell>{result.gpa.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(result.grade)}>
                          {result.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            result.is_passed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {result.is_passed ? "PASSED" : "FAILED"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewResult(result)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
