"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import {
  useGetAllExamsQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamByIdMutation,
  useRestoreExamByIdMutation,
} from "@/redux/features/exam/examApi";
import { IExam, CreateExamData } from "@/types/exam";
import { toast } from "sonner";

export default function ExamPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<IExam | null>(null);
  const [examToDelete, setExamToDelete] = useState<IExam | null>(null);

  const {
    data: examsData,
    isLoading,
    refetch,
  } = useGetAllExamsQuery(undefined);

  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const [updateExam, { isLoading: isUpdating }] = useUpdateExamMutation();
  const [deleteExam, { isLoading: isDeleting }] = useDeleteExamByIdMutation();
  const [restoreExam, { isLoading: isRestoring }] =
    useRestoreExamByIdMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateExamData>();

  const onSubmit = async (data: CreateExamData) => {
    try {
      if (editingExam) {
        await updateExam({ id: editingExam._id!, ...data }).unwrap();
        toast.success("Exam updated successfully!");
      } else {
        await createExam(data).unwrap();
        toast.success("Exam created successfully!");
      }
      reset();
      setIsDialogOpen(false);
      setEditingExam(null);
      refetch();
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
          : "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (exam: IExam) => {
    setEditingExam(exam);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExam(id).unwrap();
      toast.success("Exam moved to trash successfully!");
      refetch();
      setIsDeleteDialogOpen(false);
      setExamToDelete(null);
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
          : "Failed to move exam to trash!";
      toast.error(errorMessage);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreExam(id).unwrap();
      toast.success("Exam restored successfully!");
      refetch();
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
          : "Failed to restore exam!";
      toast.error(errorMessage);
    }
  };

  const confirmDelete = (exam: IExam) => {
    setExamToDelete(exam);
    setIsDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingExam(null);
    reset();
  };

  const handleAddExam = () => {
    setEditingExam(null);
    setIsDialogOpen(true);
    reset();
  };

  const exams = examsData?.data?.exams || [];

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
        <h1 className="text-2xl font-bold">Exam Management</h1>
        <Button className="flex items-center gap-2" onClick={handleAddExam}>
          <Plus className="h-4 w-4" />
          Add Exam
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExam ? "Edit Exam" : "Add New Exam"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Exam Name
              </label>
              <Input
                {...register("examName", {
                  required: "Exam name is required",
                  minLength: {
                    value: 3,
                    message: "Exam name must be at least 3 characters",
                  },
                })}
                defaultValue={editingExam?.examName}
                placeholder="Enter exam name"
              />
              {errors.examName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.examName.message as string}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                disabled={isCreating || isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingExam ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Exams ({exams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {exams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No exams found. Create your first exam!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam: IExam) => (
                  <TableRow
                    key={exam._id}
                    className={exam.isDeleted ? "opacity-60" : ""}
                  >
                    <TableCell className="font-medium">
                      {exam.examName}
                    </TableCell>
                    <TableCell>
                      {exam.isDeleted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Deleted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(exam.createdAt!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(exam.updatedAt!).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {exam.isDeleted ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(exam._id!)}
                            disabled={isRestoring}
                            className="text-green-600 hover:text-green-700"
                          >
                            {isRestoring ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Restore"
                            )}
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(exam)}
                              disabled={isDeleting}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => confirmDelete(exam)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to Trash?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the exam{" "}
              <span className="font-semibold">
                &ldquo;{examToDelete?.examName}&rdquo;
              </span>{" "}
              to trash. You can restore it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                examToDelete?._id && handleDelete(examToDelete._id)
              }
              className="bg-orange-600 hover:bg-orange-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Move to Trash"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
