"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { IExam } from "@/types/exam";

interface CellActionProps {
  data: IExam;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  return (
    <AlertDialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/teacher/dashboard/exam/${data._id}`)}
          >
            <span className="flex">
              <Eye className="mr-2 h-4 w-4" /> View
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/teacher/dashboard/exam/update/${data._id}`)
            }
          >
            <span className="flex">
              <Edit className="mr-2 h-4 w-4" /> Update
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <AlertDialogTrigger>
              <span className="flex">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </span>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              //              authorizedAPI
              //                .delete(`/work/${data._id}`)
              //                .then(() => {
              //                  toast.success("Project deleted successfully!");
              //                  refreshTag("work");
              //                })
              //                .catch((error) => toast.error("Something went wrong!"));
            }}
            className="bg-red-600 text-white"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const columns: ColumnDef<IExam>[] = [
  {
    accessorKey: "examName",
    header: "EXAM NAME",
  },
  {
    accessorKey: "class",
    header: "CLASS",
  },
  {
    accessorKey: "session",
    header: "SESSION",
  },
  {
    accessorKey: "examDate",
    header: "DATE",
    cell: ({ row }) => {
      const givenDate = row.getValue("examDate") as string;
      return new Date(givenDate).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
    meta: {
      className: "text-right",
    },
    size: 50,
  },
];
