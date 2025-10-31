"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Filter,
  BarChart3,
  RotateCcw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  useGetAllResultsQuery,
  useDeleteResultByIdMutation,
  useGetResultStatisticsQuery,
} from "@/redux/features/result/resultApi";
import { useGetAllExamsQuery } from "@/redux/features/exam/examApi";
import { useGetAllStudentsQuery } from "@/redux/features/student/studentApi";
import {
  IResult,
  ResultFilters,
  GradeEnum,
  IStudent as IResultStudent,
  IExam as IResultExam,
} from "@/types/result";
import { IExam } from "@/types/exam";
import { IStudent } from "@/types/student";
import { toast } from "sonner";

export default function ResultPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<IResult | null>(null);
  const [filters, setFilters] = useState<ResultFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: resultsData,
    isLoading,
    refetch,
  } = useGetAllResultsQuery({
    ...filters,
    page: currentPage,
    limit: pageSize,
  });
  const { data: examsData } = useGetAllExamsQuery(undefined);
  const { data: studentsData } = useGetAllStudentsQuery(undefined);
  const { data: statsData } = useGetResultStatisticsQuery();

  const [deleteResult, { isLoading: isDeleting }] =
    useDeleteResultByIdMutation();

  const exams = examsData?.data?.exams || [];
  const students = studentsData?.data?.students || [];
  const results = resultsData?.data?.results || [];
  const totalCount = resultsData?.data?.count || 0;
  const stats = statsData?.data;

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleDelete = async (id: string) => {
    try {
      await deleteResult(id).unwrap();
      toast.success("Result deleted successfully!");
      refetch();
      setIsDeleteDialogOpen(false);
      setResultToDelete(null);
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to delete result!";
      toast.error(errorMessage);
    }
  };

  const confirmDelete = (result: IResult) => {
    setResultToDelete(result);
    setIsDeleteDialogOpen(true);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
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

  const getStudentName = (student: string | IResultStudent) => {
    if (typeof student === "string") {
      const foundStudent = students.find((s: IStudent) => s._id === student);
      return foundStudent ? foundStudent.name : "Unknown Student";
    }
    return student?.name || "Unknown Student";
  };

  const getExamName = (exam: string | IResultExam) => {
    if (typeof exam === "string") {
      const foundExam = exams.find((e: IExam) => e._id === exam);
      return foundExam ? foundExam.examName : "Unknown Exam";
    }
    return exam?.examName || "Unknown Exam";
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Result Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsStatsDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Statistics
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => (window.location.href = "/admin/result/create")}
          >
            <Plus className="h-4 w-4" />
            Add Result
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
            <Select
              value={filters.exam || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  exam: value === "all" ? undefined : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {exams.map((exam: IExam) => (
                  <SelectItem key={exam._id} value={exam._id!}>
                    {exam.examName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.student || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  student: value === "all" ? undefined : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.map((student: IStudent) => (
                  <SelectItem key={student._id} value={student._id!}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Year"
              type="number"
              value={filters.year || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  year: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />

            <Input
              placeholder="Class"
              type="number"
              value={filters.class || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  class: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />

            <Input
              placeholder="Session"
              type="number"
              value={filters.session || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  session: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Results ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No results found. Create your first result!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result: IResult) => (
                  <TableRow key={result._id}>
                    <TableCell className="font-medium">
                      {getStudentName(result.student)}
                    </TableCell>
                    <TableCell>{getExamName(result.exam)}</TableCell>
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
                        {result.is_passed ? "Passed" : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/admin/result/edit/${result._id}`)
                          }
                          disabled={isDeleting}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => confirmDelete(result)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {results.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex} to {endIndex} of {totalCount} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Dialog */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Result Statistics</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.totalResults || 0}
                </div>
                <div className="text-sm text-gray-600">Total Results</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.averageGPA?.toFixed(2) || 0}
                </div>
                <div className="text-sm text-gray-600">Average GPA</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {stats?.passedCount || 0}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  {stats?.failedCount || 0}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              result for{" "}
              <span className="font-semibold">
                {resultToDelete && getStudentName(resultToDelete.student)}
              </span>{" "}
              in{" "}
              <span className="font-semibold">
                {resultToDelete && getExamName(resultToDelete.exam)}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                resultToDelete?._id && handleDelete(resultToDelete._id)
              }
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Result"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
