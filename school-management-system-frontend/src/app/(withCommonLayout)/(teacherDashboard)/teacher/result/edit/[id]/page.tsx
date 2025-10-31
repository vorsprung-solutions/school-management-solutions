"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { useUpdateResultMutation } from "@/redux/features/result/resultApi";
import { useGetSingleResultQuery } from "@/redux/features/result/resultApi";
import { useGetAllExamsQuery } from "@/redux/features/exam/examApi";
import {
  useGetAllStudentsQuery,
  useGetStudentsByFiltersQuery,
} from "@/redux/features/student/studentApi";
import { CreateResultData, GradeEnum } from "@/types/result";
import { IExam } from "@/types/exam";
import { IStudent } from "@/types/student";
import { toast } from "sonner";

export default function EditResultPage() {
  const router = useRouter();
  const params = useParams();
  const resultId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [studentFilters, setStudentFilters] = useState({
    class: "",
    session: "",
    group: "",
  });
  const [isFormPopulated, setIsFormPopulated] = useState(false);

  const { data: resultData, isLoading: isLoadingResult } =
    useGetSingleResultQuery(resultId);
  const { data: examsData, isLoading: isLoadingExams } =
    useGetAllExamsQuery(undefined);
  const { data: studentsData, isLoading: isLoadingStudents } =
    useGetAllStudentsQuery(undefined);
  const { data: filteredStudentsData } = useGetStudentsByFiltersQuery(
    {
      class: studentFilters.class ? Number(studentFilters.class) : undefined,
      session: studentFilters.session
        ? Number(studentFilters.session)
        : undefined,
      group: studentFilters.group || undefined,
    },
    { skip: false } // Always fetch to allow individual filters to work
  );

  const [updateResult] = useUpdateResultMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateResultData>({
    defaultValues: {
      exam: "",
      student: "",
      year: new Date().getFullYear(),
      results: [{ subject: "", marks: 0, grade: GradeEnum.A, gpa: 0 }],
      gpa: 0,
      grade: GradeEnum.A,
      is_passed: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "results",
  });

  const exams = examsData?.data?.exams || [];
  const students = studentsData?.data?.students || [];
  const filteredStudents = filteredStudentsData?.data || [];
  const result = resultData?.data;

  // Determine which students to show based on filters
  const hasActiveFilters =
    studentFilters.class || studentFilters.session || studentFilters.group;
  const studentsToShow = hasActiveFilters
    ? filteredStudents || []
    : students || [];

  const watchedResults = watch("results");

  // Ensure calculations update when form values change
  useEffect(() => {
    // This will trigger re-render when watchedResults changes
  }, [watchedResults]);

  // Calculate GPA based on results (for display only)
  const calculateGPA = () => {
    if (!watchedResults || watchedResults.length === 0) return 0;
    const validResults = watchedResults.filter(
      (result) =>
        result.gpa !== undefined &&
        result.gpa !== null &&
        !isNaN(Number(result.gpa))
    );
    if (validResults.length === 0) return 0;
    const totalGPA = validResults.reduce(
      (sum, result) => sum + Number(result.gpa || 0),
      0
    );
    return totalGPA / validResults.length;
  };

  // Calculate total marks (for display only)
  const calculateTotalMarks = () => {
    if (!watchedResults) return 0;
    const validResults = watchedResults.filter(
      (result) =>
        result.marks !== undefined &&
        result.marks !== null &&
        !isNaN(Number(result.marks))
    );
    return validResults.reduce(
      (sum, result) => sum + Number(result.marks || 0),
      0
    );
  };

  // Determine grade based on GPA (5-point scale) - for display only
  const determineGrade = (gpa: number): GradeEnum => {
    if (gpa >= 4.7) return GradeEnum.A_PLUS;
    if (gpa >= 4.0) return GradeEnum.A;
    if (gpa >= 3.7) return GradeEnum.A_MINUS;
    if (gpa >= 3.3) return GradeEnum.B_PLUS;
    if (gpa >= 3.0) return GradeEnum.B;
    if (gpa >= 2.7) return GradeEnum.B_MINUS;
    if (gpa >= 2.3) return GradeEnum.C_PLUS;
    if (gpa >= 2.0) return GradeEnum.C;
    if (gpa >= 1.7) return GradeEnum.C_MINUS;
    if (gpa >= 1.3) return GradeEnum.D_PLUS;
    if (gpa >= 1.0) return GradeEnum.D;
    return GradeEnum.F;
  };

  // Determine if passed based on GPA (for display only)
  const determinePassed = (gpa: number): boolean => {
    return gpa >= 2.0;
  };

  // Load result data when available
  useEffect(() => {
    if (result) {
      const examId =
        typeof result.exam === "string" ? result.exam : result.exam._id!;
      const studentId =
        typeof result.student === "string"
          ? result.student
          : result.student._id!;

      setValue("exam", examId);
      setValue("student", studentId);
      setValue("year", result.year);
      setValue("class", result.class);
      setValue("session", result.session);
      setValue("group", result.group || "");
      setValue("results", result.results);
      setValue("gpa", result.gpa);
      setValue("grade", result.grade);
      setValue("is_passed", result.is_passed);

      // Set student filters based on result data
      setStudentFilters({
        class: result.class.toString(),
        session: result.session.toString(),
        group: result.group || "",
      });

      // Mark form as populated
      setIsFormPopulated(true);
    }
  }, [result, setValue]);

  const onSubmit = async (data: CreateResultData) => {
    try {
      setIsLoading(true);

      // Convert string values to numbers
      const resultData = {
        ...data,
        year: Number(data.year),
        class: Number(data.class),
        session: Number(data.session),
        results: data.results.map((result) => ({
          ...result,
          marks: Number(result.marks),
          gpa: Number(result.gpa),
        })),
        // Remove frontend GPA calculation - let backend handle it
        total_marks: 0, // Backend will calculate this
        gpa: 0, // Backend will calculate this
        grade: GradeEnum.A, // Backend will calculate this
        is_passed: true, // Backend will calculate this
      };

      await updateResult({ id: resultId, data: resultData }).unwrap();
      toast.success("Result updated successfully!");
      router.push("/admin/result");
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
          : "Failed to update result!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addSubject = () => {
    append({ subject: "", marks: 0, grade: GradeEnum.A, gpa: 0 });
  };

  const removeSubject = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (isLoadingResult || isLoadingExams || isLoadingStudents) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6">
        <div className="text-center py-8 text-gray-500">Result not found!</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Result</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Student
                </label>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Class"
                      type="number"
                      value={studentFilters.class}
                      onChange={(e) =>
                        setStudentFilters((prev) => ({
                          ...prev,
                          class: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Session"
                      type="number"
                      value={studentFilters.session}
                      onChange={(e) =>
                        setStudentFilters((prev) => ({
                          ...prev,
                          session: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="Group (Optional)"
                      value={studentFilters.group}
                      onChange={(e) =>
                        setStudentFilters((prev) => ({
                          ...prev,
                          group: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <input
                    {...register("student", {
                      required: "Student is required",
                    })}
                    type="hidden"
                  />
                  {isFormPopulated && (
                    <Select
                      key={`student-${watch("student")}`}
                      value={watch("student") || ""}
                      onValueChange={(value) => {
                        setValue("student", value, { shouldValidate: true });
                        // Auto-populate student details when selected
                        if (value) {
                          const selectedStudent = studentsToShow.find(
                            (s: IStudent) => s._id === value
                          );
                          if (selectedStudent) {
                            setValue("class", selectedStudent.class);
                            setValue("session", selectedStudent.session);
                            setValue("group", selectedStudent.group || "");
                          }
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Student" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(studentsToShow) &&
                          studentsToShow.map((student: IStudent) => (
                            <SelectItem key={student._id} value={student._id!}>
                              {student.name} - Class {student.class}, Session{" "}
                              {student.session}
                              {student.group && `, ${student.group}`}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {errors.student && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.student.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Exam</label>
                <input
                  {...register("exam", { required: "Exam is required" })}
                  type="hidden"
                />
                {isFormPopulated && (
                  <Select
                    key={`exam-${watch("exam")}`}
                    value={watch("exam") || ""}
                    onValueChange={(value) =>
                      setValue("exam", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(exams) &&
                        exams.map((exam: IExam) => (
                          <SelectItem key={exam._id} value={exam._id!}>
                            {exam.examName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.exam && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.exam.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <Input
                    {...register("year", { required: "Year is required" })}
                    type="number"
                    placeholder="2024"
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Class
                  </label>
                  <Input
                    {...register("class", { required: "Class is required" })}
                    type="number"
                    placeholder="10"
                  />
                  {errors.class && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.class.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Session
                  </label>
                  <Input
                    {...register("session", {
                      required: "Session is required",
                    })}
                    type="number"
                    placeholder="1"
                  />
                  {errors.session && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.session.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Group (Optional)
                </label>
                <Input
                  {...register("group")}
                  placeholder="Science/Commerce/Arts"
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Total Marks
                  </label>
                  <div className="text-2xl font-bold text-blue-600">
                    {calculateTotalMarks()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Average GPA
                  </label>
                  <div className="text-2xl font-bold text-green-600">
                    {calculateGPA().toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Grade
                  </label>
                  <div className="text-2xl font-bold text-purple-600">
                    {determineGrade(calculateGPA())}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <div
                    className={`text-2xl font-bold ${
                      determinePassed(calculateGPA())
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {determinePassed(calculateGPA()) ? "Passed" : "Failed"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Results */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Subject Results</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={addSubject}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Subject
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      {...register(`results.${index}.subject` as const, {
                        required: "Subject is required",
                      })}
                      placeholder="Subject name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks
                    </label>
                    <Input
                      {...register(`results.${index}.marks` as const, {
                        required: "Marks is required",
                        min: {
                          value: 0,
                          message: "Marks must be non-negative",
                        },
                        max: { value: 100, message: "Marks cannot exceed 100" },
                      })}
                      type="number"
                      placeholder="0-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grade
                    </label>
                    <Select
                      value={watch(`results.${index}.grade`) || GradeEnum.A}
                      onValueChange={(value) =>
                        setValue(
                          `results.${index}.grade` as const,
                          value as GradeEnum
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(GradeEnum).map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">
                        GPA
                      </label>
                      <Input
                        {...register(`results.${index}.gpa` as const, {
                          required: "GPA is required",
                          min: {
                            value: 0,
                            message: "GPA must be non-negative",
                          },
                          max: {
                            value: 5,
                            message: "Subject GPA cannot exceed 5",
                          },
                        })}
                        type="number"
                        step="0.01"
                        placeholder="0-5"
                      />
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubject(index)}
                        className="mb-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Update Result
          </Button>
        </div>
      </form>
    </div>
  );
}
